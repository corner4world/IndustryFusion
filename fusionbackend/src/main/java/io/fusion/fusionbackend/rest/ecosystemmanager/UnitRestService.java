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

package io.fusion.fusionbackend.rest.ecosystemmanager;

import io.fusion.fusionbackend.dto.UnitDto;
import io.fusion.fusionbackend.dto.mappers.UnitMapper;
import io.fusion.fusionbackend.rest.annotations.IsEcosystemUser;
import io.fusion.fusionbackend.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@IsEcosystemUser
public class UnitRestService {
    private final UnitService unitService;
    private final UnitMapper unitMapper;

    @Autowired
    public UnitRestService(UnitService unitService, UnitMapper unitMapper) {
        this.unitService = unitService;
        this.unitMapper = unitMapper;
    }

    @GetMapping(path = "/quantitytypes/{quantityTypeId}/units")
    public Set<UnitDto> getUnitsOfQuantityType() {
        return unitMapper.toDtoSet(unitService.getAllUnits());
    }

    @GetMapping(path = "/quantitytypes/{quantityTypeId}/units/{unitId}")
    public UnitDto getUnitOfQuantityType(@PathVariable final Long unitId,
                                         @PathVariable final Long quantityTypeId,
                                         @RequestParam(defaultValue = "false") final boolean embedChildren) {
        return unitMapper.toDto(unitService.getUnit(quantityTypeId, unitId), embedChildren);
    }

    @PostMapping(path = "/quantitytypes/{quantityTypeId}/units")
    public UnitDto createUnitOfQuantityType(@PathVariable final Long quantityTypeId,
                                            @RequestBody final UnitDto unitDto) {
        return unitMapper.toDto(unitService.createUnit(quantityTypeId, unitMapper.toEntity(unitDto)),
                false);
    }

    @PatchMapping(path = "/quantitytypes/{quantityTypeId}/units/{unitId}")
    public UnitDto updateUnitOfQuantityType(@PathVariable final Long quantityTypeId,
                                            @PathVariable final Long unitId,
                                            @RequestBody final UnitDto unitDto) {
        return unitMapper.toDto(unitService.updateUnit(quantityTypeId, unitId, unitMapper.toEntity(unitDto)),
                false);
    }

    @DeleteMapping(path = "/quantitytypes/{quantityTypeId}/units/{unitId}")
    public void deleteUnit(@PathVariable final Long quantityTypeId,
                           @PathVariable final Long unitId) {
        unitService.deleteUnit(quantityTypeId, unitId);
    }
}
