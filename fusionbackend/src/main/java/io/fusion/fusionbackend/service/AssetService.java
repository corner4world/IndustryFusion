/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package io.fusion.fusionbackend.service;

import io.fusion.fusionbackend.exception.ResourceNotFoundException;
import io.fusion.fusionbackend.model.Asset;
import io.fusion.fusionbackend.model.AssetSeries;
import io.fusion.fusionbackend.model.Company;
import io.fusion.fusionbackend.model.FactorySite;
import io.fusion.fusionbackend.model.FieldInstance;
import io.fusion.fusionbackend.model.Room;
import io.fusion.fusionbackend.repository.AssetRepository;
import io.fusion.fusionbackend.repository.FieldInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Transactional
public class AssetService {
    private final AssetRepository assetRepository;
    private final FieldInstanceRepository fieldInstanceRepository;
    private final RoomService roomService;
    private final AssetSeriesService assetSeriesService;
    private final CompanyService companyService;
    private final FactorySiteService factorySiteService;
    private final FieldInstanceService fieldInstanceService;

    @Autowired
    public AssetService(AssetRepository assetRepository,
                        FieldInstanceRepository fieldInstanceRepository,
                        RoomService roomService,
                        AssetSeriesService assetSeriesService,
                        CompanyService companyService,
                        FactorySiteService factorySiteService,
                        FieldInstanceService fieldInstanceService) {
        this.assetRepository = assetRepository;
        this.fieldInstanceRepository = fieldInstanceRepository;
        this.roomService = roomService;
        this.assetSeriesService = assetSeriesService;
        this.companyService = companyService;
        this.factorySiteService = factorySiteService;
        this.fieldInstanceService = fieldInstanceService;
    }

    public Asset getAssetById(final Long assetId) {
        return assetRepository.findById(assetId).orElseThrow(ResourceNotFoundException::new);
    }

    private Set<Asset> getAssetsByAssetSeries(final Long assetSeriesId) {
        return assetRepository.findAllByAssetSeriesId(AssetRepository.DEFAULT_SORT, assetSeriesId);
    }

    private Asset getAssetByAssetSeries(final Long assetSeriesId, final Long assetId) {
        return assetRepository.findByAssetSeriesIdAndId(assetSeriesId, assetId)
                .orElseThrow(ResourceNotFoundException::new);
    }

    private Set<Asset> getAssetsByRoom(final Long roomId) {
        return assetRepository.findAllByRoomId(AssetRepository.DEFAULT_SORT, roomId);
    }

    private Asset getAssetByRoom(final Long roomId, final Long assetId) {
        return assetRepository.findByRoomIdAndId(roomId, assetId).orElseThrow(ResourceNotFoundException::new);
    }

    public Set<Asset> getAssetsByCompany(final Long companyId) {
        return assetRepository.findAllByCompanyId(AssetRepository.DEFAULT_SORT, companyId);
    }

    public Set<Asset> getAssetsByFactorySite(final Long companyId, final Long factorySiteId) {
        // Make sure factory site belongs to company
        factorySiteService.getFactorySiteByCompany(companyId, factorySiteId, false);
        return assetRepository.findAllByFactorySiteId(AssetRepository.DEFAULT_SORT, factorySiteId);
    }

    public Asset getAssetByCompany(final Long companyId, final Long assetId) {
        return assetRepository.findByCompanyIdAndId(companyId, assetId).orElseThrow(ResourceNotFoundException::new);
    }

    public Set<Asset> getAssetsCheckFullPath(final Long companyId, final Long factorySiteId, final Long roomId) {
        // Make sure room and factory site belongs to company
        roomService.getRoomCheckFullPath(companyId, factorySiteId, roomId, false);
        return getAssetsByRoom(roomId);
    }

    public Asset getAssetCheckFullPath(final Long companyId, final Long factorySiteId, final Long roomId,
                                       final Long assetId) {
        final Asset foundAsset = getAssetByRoom(roomId, assetId);
        if (!foundAsset.getRoom().getFactorySite().getId().equals(factorySiteId)
                || !foundAsset.getRoom().getFactorySite().getCompany().getId().equals(companyId)) {
            throw new ResourceNotFoundException();
        }
        return foundAsset;
    }

    public Set<Asset> getAssetsOverAssetSeries(final Long companyId, final Long assetSeriesId) {
        assetSeriesService.getAssetSeriesByCompany(companyId, assetSeriesId); // Make asset series belongs to company
        return getAssetsByAssetSeries(assetSeriesId);
    }

    public Asset getAssetOverAssetSeries(final Long companyId, final Long assetSeriesId, final Long assetId) {
        assetSeriesService.getAssetSeriesByCompany(companyId, assetSeriesId); // Make asset series belongs to company
        return getAssetByAssetSeries(assetSeriesId, assetId);
    }

    public Asset moveAssetCompany(final Long companyId, final Long assetId, final Long targetCompanyId) {
        final Asset asset = getAssetByCompany(companyId, assetId);
        final Company targetCompany = companyService.getCompany(targetCompanyId, false);

        if (asset.getRoom() != null) {
            asset.getRoom().getAssets().remove(asset);
            asset.setRoom(null);
        }

        asset.getCompany().getAssets().remove(asset);

        asset.setCompany(targetCompany);
        targetCompany.getAssets().add(asset);

        return asset;
    }

    @Transactional
    public Asset createAssetAggregate(final Long companyId, final Long assetSeriesId, final Asset asset) {
        final AssetSeries assetSeries = assetSeriesService.getAssetSeriesByCompany(companyId, assetSeriesId);
        final Company targetCompany = assetSeries.getCompany();

        targetCompany.getAssets().add(asset);
        asset.setCompany(targetCompany);
        assetSeries.getAssets().add(asset);
        asset.setAssetSeries(assetSeries);

        asset.getFieldInstances().forEach(fieldInstance -> {
            fieldInstance.setAsset(asset);
            fieldInstance.setFieldSource(assetSeries.getFieldSources().stream()
                    .filter(value -> value.getId().equals(fieldInstance.getFieldSource().getId()))
                    .findFirst()
                    .get()
            );
        });

        if (asset.getRoom() != null && asset.getRoom().getFactorySite() != null) {
            final Room newRoom = roomService.createRoomAndFactorySite(companyId, asset.getRoom(),
                    asset.getRoom().getFactorySite());
            asset.setRoom(newRoom);
            newRoom.getAssets().add(asset);
        }

        validate(asset);

        return assetRepository.save(asset);
    }

    public void validate(final Asset asset) {
        if (asset.getCompany() == null) {
            throw new RuntimeException("Company has to exist in an Asset");
        }
        if (asset.getFieldInstances() == null) {
            throw new RuntimeException("FieldInstances has to exist in an Asset");
        }
        if (asset.getAssetSeries() == null) {
            throw new RuntimeException("AssetSeries has to exist in an Asset");
        }
        if (asset.getConstructionDate() == null) {
            throw new RuntimeException("ConstructionDate has to exist in an Asset");
        }
        if (asset.getGuid() == null) {
            throw new RuntimeException("GUID has to exist in an Asset");
        }
        if (asset.getName() == null) {
            throw new RuntimeException("Asset must have a name");
        }

        asset.getFieldInstances().forEach(fieldInstanceService::validate);

        validateSubsystems(asset);
    }

    private void validateSubsystems(Asset asset) {
        for (Asset subsystem : asset.getSubsystems()) {
            if (subsystem.getId().equals(asset.getId())) {
                throw new RuntimeException("An asset is not allowed to be a subsystem of itself.");
            }
            if (subsystem.getAssetSeries().getId().equals(asset.getAssetSeries().getId())) {
                throw new RuntimeException("A subsystem has to be of another asset series than the parent asset.");
            }
        }
    }

    public void deleteAsset(final Long companyId, final Long assetId) {
        final Asset asset = getAssetByCompany(companyId, assetId);

        if (asset.getRoom() != null) {
            asset.getRoom().getAssets().remove(asset);
            asset.setRoom(null);
        }

        asset.getCompany().getAssets().remove(asset);
        asset.setCompany(null);

        asset.getAssetSeries().getAssets().remove(asset);
        asset.setAssetSeries(null);

        fieldInstanceRepository.deleteAll(asset.getFieldInstances());
        assetRepository.delete(asset);
    }

    public Asset removeAssetFromRoom(final Long companyId, final Long factorySiteId, final Long roomId,
                                     final Long assetId) {
        final Asset asset = getAssetCheckFullPath(companyId, factorySiteId, roomId, assetId);
        final Room room = asset.getRoom();

        room.getAssets().remove(asset);
        asset.setRoom(null);

        return asset;
    }

    public Set<Asset> moveAssetsToRoom(final Long companyId, final Long factorySiteId, final Long roomId,
                                       final Asset[] assets) {
        Set<Asset> assetSet = new HashSet<>();
        this.moveUnselectedAssetsToNoSpecificRoom(companyId, factorySiteId, roomId, assets);
        for (Asset asset : assets) {
            assetSet.add(this.moveAssetToRoom(companyId, factorySiteId, roomId, asset.getId()));
        }
        return assetSet;
    }

    public void moveUnselectedAssetsToNoSpecificRoom(final Long companyId, final Long factorySiteId, final Long roomId,
                                                     final Asset[] updatedAssets) {
        Set<Asset> previouslyAssets = this.roomService.getRoomCheckFullPath(companyId, factorySiteId,
                roomId, true).getAssets();
        Set<Asset> updatedAssetsSet = new HashSet<>(Arrays.asList(updatedAssets));
        Asset[] unselectedAssets = previouslyAssets.stream().filter(asset -> !updatedAssetsSet.contains(asset))
                .toArray(Asset[]::new);

        if (unselectedAssets.length > 0) {
            Set<Room> factoryRooms = this.factorySiteService.getFactorySiteByCompany(companyId,
                    factorySiteId, true).getRooms();
            Room noSpecificRoom = getOrCreateNoSpecificRoom(companyId, factorySiteId, factoryRooms);
            for (Asset asset : unselectedAssets) {
                Room oldAssetRoom = this.roomService.getRoomCheckFullPath(companyId, factorySiteId, roomId, true);
                if (oldAssetRoom != null) {
                    oldAssetRoom.getAssets().remove(asset);
                }
                noSpecificRoom.getAssets().add(asset);
                asset.setRoom(noSpecificRoom);
            }
        }
    }

    private Room getOrCreateNoSpecificRoom(Long companyId, Long factorySiteId, Set<Room> factoryRooms) {
        Room noSpecificRoom = factoryRooms.stream().filter(factoryRoom -> factoryRoom.getName()
                .equals(Room.NO_SPECIFIC_ROOM_NAME)).findFirst().orElse(null);
        if (noSpecificRoom == null) {
            noSpecificRoom = Room.getUnspecificRoomInstance();
            this.roomService.createRoom(companyId, factorySiteId, noSpecificRoom);
        }
        return noSpecificRoom;
    }

    public Asset moveAssetToRoom(final Long companyId, final Long factorySiteId, final Long newRoomId,
                                 final Long assetId) {
        final Asset asset = getAssetByCompany(companyId, assetId);

        final Room oldAssetRoom = asset.getRoom();
        final Room newAssetRoom = roomService.getRoomCheckFullPath(companyId, factorySiteId, newRoomId, false);

        if (oldAssetRoom != null) {
            oldAssetRoom.getAssets().remove(asset);
            asset.setRoom(null);
        }

        newAssetRoom.getAssets().add(asset);
        asset.setRoom(newAssetRoom);

        return asset;
    }

    public Asset updateAssetSeriesAsset(final Long companyId, final Long assetSeriesId, final Long assetId,
                                        final Asset sourceAsset) {
        final Asset targetAsset = getAssetOverAssetSeries(companyId, assetSeriesId, assetId);

        validateForUpdates(companyId, assetSeriesId, targetAsset);

        List<FieldInstance> deletedFieldSources = targetAsset.calculateDeletedFieldSources(sourceAsset);
        deletedFieldSources.forEach(fieldInstanceService::delete);

        targetAsset.copyFrom(sourceAsset);

        updateRoomOfAssetSeriesAsset(companyId, sourceAsset, targetAsset);

        validate(targetAsset);

        return targetAsset;
    }

    private void validateForUpdates(final Long companyId, final Long assetSeriesId, final Asset targetAsset) {
        if (!Objects.equals(targetAsset.getAssetSeries().getId(), assetSeriesId)) {
            throw new IllegalStateException("It is not allowed to change the asset series of an asset.");
        }
        if (!Objects.equals(targetAsset.getCompany().getId(), companyId)) {
            throw new IllegalStateException("Target and source company of asset must be the same.");
        }
    }

    private void updateRoomOfAssetSeriesAsset(Long companyId, Asset sourceAsset, Asset targetAsset) {
        final boolean existsSourceAssetRoom = sourceAsset.getRoom() != null
                && sourceAsset.getRoom().getFactorySite() != null;
        final boolean existsTargetAssetRoom = targetAsset.getRoom() != null && targetAsset.getRoom().getId() != null
                && targetAsset.getRoom().getFactorySite() != null;

        final boolean wasRoomAdded = existsSourceAssetRoom && !existsTargetAssetRoom;
        final boolean wasRoomUpdated = existsSourceAssetRoom && targetAsset.getRoom() != null;
        final boolean wasRoomDeleted = !existsSourceAssetRoom && existsTargetAssetRoom;

        if (wasRoomAdded) {
            final Room newRoom = roomService.createRoomAndFactorySite(companyId, sourceAsset.getRoom(),
                    sourceAsset.getRoom().getFactorySite());
            targetAsset.setRoom(newRoom);
            newRoom.getAssets().add(targetAsset);

        } else if (wasRoomUpdated) {
            final FactorySite updatedFactorySite = factorySiteService.updateFactorySite(companyId,
                    targetAsset.getRoom().getFactorySite().getId(), sourceAsset.getRoom().getFactorySite());

            final Room updatedRoom = roomService.updateRoom(companyId, updatedFactorySite.getId(),
                    targetAsset.getRoom().getId(), sourceAsset.getRoom());
            targetAsset.setRoom(updatedRoom);

        } else if (wasRoomDeleted) {
            roomService.deleteRoom(companyId, targetAsset.getRoom().getFactorySite().getId(),
                    targetAsset.getRoom().getId());
            targetAsset.setRoom(null);
        }
    }

    public Asset transferFromFleetToFactory(final Long companyId, final Long targetCompanyId, final Long assetSeriesId,
                                            final Long assetId) {
        final Asset targetAsset = getAssetOverAssetSeries(companyId, assetSeriesId, assetId);
        final Company newCompany = companyService.getCompany(targetCompanyId, false);

        targetAsset.setCompany(newCompany);
        if (targetAsset.getRoom() != null) {
            Room room = roomService.getRoomById(targetAsset.getRoom().getId());
            room.getFactorySite().setCompany(newCompany);
            targetAsset.setRoom(room);
        }

        return targetAsset;
    }

    public Asset updateRoomAsset(final Long companyId, final Long factorySiteId, final Long roomId, final Long assetId,
                                 final Asset sourceAsset) {
        final Asset targetAsset = getAssetCheckFullPath(companyId, factorySiteId, roomId, assetId);

        targetAsset.copyFrom(sourceAsset);

        validate(targetAsset);

        return targetAsset;
    }

    public Asset updateAsset(final Asset sourceAsset) {
        final Asset targetAsset = getAssetById(sourceAsset.getId());
        Room oldAssetRoom = targetAsset.getRoom();
        Room newAssetRoom = this.roomService.getRoomById(sourceAsset.getRoom().getId());

        targetAsset.copyFrom(sourceAsset);

        return updateRoom(oldAssetRoom, newAssetRoom, targetAsset);
    }

    private Asset updateRoom(Room oldAssetRoom, Room newAssetRoom, Asset targetAsset) {

        targetAsset.setRoom(newAssetRoom);
        if (oldAssetRoom != null) {
            oldAssetRoom.getAssets().remove(targetAsset);
        }
        newAssetRoom.getAssets().add(targetAsset);

        return targetAsset;
    }

    public Set<FieldInstance> getFieldInstancesCheckFullPath(final Long companyId, final Long factorySiteId,
                                                             final Long roomId, final Long assetId) {
        final Asset asset = getAssetCheckFullPath(companyId, factorySiteId, roomId, assetId);
        return asset.getFieldInstances();
    }

    public Set<FieldInstance> getFieldInstances(final Long companyId, final Long assetId) {
        final Asset asset = getAssetByCompany(companyId, assetId);
        return asset.getFieldInstances();
    }

    public FieldInstance getFieldInstance(final Long companyId, final Long assetId, final Long fieldInstanceId) {
        final Asset assetSeries = getAssetByCompany(companyId, assetId);
        return assetSeries.getFieldInstances().stream()
                .filter(field -> field.getId().equals(fieldInstanceId))
                .findAny()
                .orElseThrow(ResourceNotFoundException::new);
    }

    public FieldInstance getFieldInstance(final Asset assetSeries, final Long fieldInstanceId) {
        return assetSeries.getFieldInstances().stream()
                .filter(field -> field.getId().equals(fieldInstanceId))
                .findAny()
                .orElseThrow(ResourceNotFoundException::new);
    }

    public Set<Asset> findSubsystemCandidates(Long companyId, Long parentAssetSeriesId) {
        return assetRepository.findSubsystemCandidates(parentAssetSeriesId, companyId);
    }
}
