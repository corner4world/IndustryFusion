package io.fusion.fusionbackend.test.persistence.querytests;

import io.fusion.fusionbackend.model.AssetType;
import io.fusion.fusionbackend.model.AssetTypeTemplate;
import io.fusion.fusionbackend.repository.AssetTypeTemplateRepository;
import io.fusion.fusionbackend.test.persistence.PersistenceTestsBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

import static io.fusion.fusionbackend.test.persistence.builder.AssetTypeBuilder.anAssetType;
import static io.fusion.fusionbackend.test.persistence.builder.AssetTypeTemplateBuilder.anAssetTypeTemplate;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class QueryTestsAssetTypeTemplate extends PersistenceTestsBase {

    @Autowired
    AssetTypeTemplateRepository assetTypeTemplateRepository;


    @Test
    void findSubsystemCandidates() {

        AssetTypeTemplate parent = persisted(anAssetTypeTemplate()
                .forType(persisted(anAssetType())))
                .build();

        AssetTypeTemplate subsystemCandidate = persisted(anAssetTypeTemplate()
                .forType(persisted(anAssetType())))
                .build();

        Set<AssetTypeTemplate> subsystemCandidates = assetTypeTemplateRepository
                .findSubsystemCandidates(parent.getAssetType().getId(), parent.getId());

        assertTrue(subsystemCandidates.contains(subsystemCandidate));
    }

    @Test
    void findSubsystemCandidates_subsystemsShouldNotBeFound() {

        AssetTypeTemplate parent = persisted(anAssetTypeTemplate()
                .forType(persisted(anAssetType())))
                .build();

        AssetTypeTemplate subsystem = persisted(anAssetTypeTemplate()
                .forType(persisted(anAssetType()))
                .asSubsystemOf(parent))
                .build();

        Set<AssetTypeTemplate> subsystemCandidates = assetTypeTemplateRepository
                .findSubsystemCandidates(parent.getAssetType().getId(), parent.getId());

        assertTrue(parent.getSubsystems().contains(subsystem));
        assertTrue(subsystemCandidates.isEmpty());
    }

    @Test
    void findSubsystemCandidates_forDifferentAssetType() {

        AssetType parentAssetType = persisted(anAssetType()).build();

        AssetTypeTemplate parent = persisted(anAssetTypeTemplate()
                .forType(parentAssetType))
                .build();

        AssetTypeTemplate assetTypeTemplateOfSameAssetType = persisted(anAssetTypeTemplate()
                .forType(parentAssetType))
                .build();

        AssetTypeTemplate assetTypeTemplateOfOtherAssetType = persisted(anAssetTypeTemplate()
                .forType(persisted(anAssetType())))
                .build();

        Set<AssetTypeTemplate> subsystemCandidates = assetTypeTemplateRepository
                .findSubsystemCandidates(parent.getAssetType().getId(), parent.getId());

        assertTrue(subsystemCandidates.contains(assetTypeTemplateOfOtherAssetType));
        assertFalse(subsystemCandidates.contains(assetTypeTemplateOfSameAssetType));
    }

}
