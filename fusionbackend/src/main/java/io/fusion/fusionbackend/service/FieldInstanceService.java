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

import io.fusion.fusionbackend.model.FieldInstance;
import io.fusion.fusionbackend.model.FieldSource;
import io.fusion.fusionbackend.model.FieldTarget;
import io.fusion.fusionbackend.model.Unit;
import io.fusion.fusionbackend.model.enums.FieldThresholdType;
import io.fusion.fusionbackend.model.enums.QuantityDataType;
import io.fusion.fusionbackend.repository.FieldInstanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class FieldInstanceService {
    private static final Logger LOG = LoggerFactory.getLogger(FieldInstanceService.class);
    private final ThresholdService thresholdService;
    private final UnitService unitService;
    private final FieldInstanceRepository fieldInstanceRepository;

    @Autowired
    public FieldInstanceService(ThresholdService thresholdService,
                                UnitService unitService,
                                FieldInstanceRepository fieldInstanceRepository) {
        this.thresholdService = thresholdService;
        this.unitService = unitService;
        this.fieldInstanceRepository = fieldInstanceRepository;
    }

    public FieldInstance initFieldInstanceDraft(FieldSource fieldSource) {
        if (fieldSource == null) {
            return null;
        }

        String generatedExternalName = this.createExternalNameFromFieldTarget(fieldSource.getFieldTarget());

        return FieldInstance.builder()
                .fieldSource(fieldSource)
                .name(fieldSource.getName())
                .description(fieldSource.getDescription())
                .externalName(generatedExternalName)
                .absoluteThreshold(thresholdService.initThresholdDraft(fieldSource.getAbsoluteThreshold()))
                .idealThreshold(thresholdService.initThresholdDraft(fieldSource.getIdealThreshold()))
                .criticalThreshold(thresholdService.initThresholdDraft(fieldSource.getCriticalThreshold()))
                .value(fieldSource.getValue())
                .build();
    }

    private String createExternalNameFromFieldTarget(FieldTarget fieldTarget) {
        if (fieldTarget == null) {
            return null;
        }

        String nameWithUnderscores = fieldTarget.getName().replace(' ', '_').replace('-', '_');
        String nameWithOnlyCharactersNumbersAndUnderscores = nameWithUnderscores.replaceAll("\\W", "");

        return nameWithOnlyCharactersNumbersAndUnderscores.toLowerCase();
    }

    public boolean isThresholdsValid(FieldInstance fieldInstance,
                                     FieldThresholdType fieldThresholdType,
                                     QuantityDataType quantityDataType) {

        if (!isThresholdsAllowed(quantityDataType)) {
            return hasNoThresholdValues(fieldInstance);
        }

        switch (fieldThresholdType) {
            case MANDATORY:
                return hasPairwiseValues(fieldInstance) && hasBothMandatoryThresholdValues(fieldInstance);
            case OPTIONAL:
                return hasNoThresholdValues(fieldInstance)
                        || hasPairwiseValues(fieldInstance) && hasBothMandatoryThresholdValues(fieldInstance);
            case DISABLED:
                return hasNoThresholdValues(fieldInstance);
            default:
                return false;
        }
    }

    private boolean isThresholdsAllowed(QuantityDataType quantityDataType) {
        return quantityDataType.equals(QuantityDataType.NUMERIC);
    }

    private boolean hasNoThresholdValues(final FieldInstance fieldInstance) {
        return ThresholdService.hasNoValue(fieldInstance.getAbsoluteThreshold())
                && ThresholdService.hasNoValue(fieldInstance.getIdealThreshold())
                && ThresholdService.hasNoValue(fieldInstance.getCriticalThreshold());
    }

    private boolean hasBothMandatoryThresholdValues(final FieldInstance fieldInstance) {
        return ThresholdService.hasBothValues(fieldInstance.getAbsoluteThreshold());
    }

    private boolean hasPairwiseValues(final FieldInstance fieldInstance) {
        return ThresholdService.hasPairwiseValues(fieldInstance.getAbsoluteThreshold())
                && ThresholdService.hasPairwiseValues(fieldInstance.getIdealThreshold())
                && ThresholdService.hasPairwiseValues(fieldInstance.getCriticalThreshold());
    }

    public void validate(FieldInstance fieldInstance) {
        if (fieldInstance.getFieldSource() == null) {
            throw new RuntimeException("Field instance must have a FieldSource");
        }

        final FieldThresholdType fieldThresholdType = fieldInstance.getFieldSource()
                .getFieldTarget()
                .getField()
                .getThresholdType();

        if (fieldInstance.getFieldSource().getSourceUnit() != null) {
            final Unit unit = unitService.getUnit(fieldInstance.getFieldSource().getSourceUnit().getId());
            final QuantityDataType quantityDataType = unit.getQuantityType().getDataType();

            if (!isThresholdsValid(fieldInstance, fieldThresholdType, quantityDataType)) {
                LOG.warn("Thresholds of field instance with id {} are not valid.\r\n"
                                + "Absolute Threshold: {}, ideal Threshold: {}, critical threshold: {}",
                        fieldInstance.getId(), fieldInstance.getAbsoluteThreshold(),
                        fieldInstance.getIdealThreshold(), fieldInstance.getCriticalThreshold());
                throw new RuntimeException("Thresholds are not valid in every field instance");
            }
        }
    }

    public void delete(FieldInstance fieldInstance) {
        fieldInstance.getAsset().getFieldInstances().remove(fieldInstance);
        fieldInstance.setAsset(null);
        fieldInstanceRepository.delete(fieldInstance);
    }
}
