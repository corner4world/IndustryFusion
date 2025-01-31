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

package io.fusion.fusionbackend.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import io.fusion.fusionbackend.model.Threshold;
import io.fusion.fusionbackend.model.enums.FieldDataType;
import io.fusion.fusionbackend.model.enums.FieldType;
import io.fusion.fusionbackend.model.enums.FieldWidgetType;
import io.fusion.fusionbackend.model.enums.QuantityDataType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
public class FieldDetailsDto extends BaseEntityDto {
    private Long assetId;
    private Long fieldSourceId;
    private String externalName;
    private FieldType fieldType;
    private Boolean mandatory;
    private String name;
    private String description;
    private String dashboardGroup;
    private String type;
    private String unit;
    private Double accuracy;
    private String value;
    private QuantityDataType quantityDataType;
    private FieldWidgetType widgetType;
    private String fieldLabel;
    private Threshold absoluteThreshold;
    private Threshold idealThreshold;
    private Threshold criticalThreshold;
    private FieldDataType fieldDataType;
    private Set<FieldOptionDto> enumOptions;

    @JsonCreator
    public FieldDetailsDto() {
    }
}
