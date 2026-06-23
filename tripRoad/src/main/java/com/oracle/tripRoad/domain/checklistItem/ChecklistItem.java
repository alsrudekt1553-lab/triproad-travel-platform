package com.oracle.tripRoad.domain.checklistItem;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CHECKLIST_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistItem {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "checklist_item_seq_generator"
    )
    @SequenceGenerator(
            name = "checklist_item_seq_generator",
            sequenceName = "CHECKLIST_ITEM_SEQ",
            allocationSize = 1
    )
    @Column(name = "ITEM_ID")
    private Long itemId;

    @Column(name = "CHECKLIST_ID", nullable = false)
    private Long checklistId;

    @Column(name = "ITEM_NAME", length = 100, nullable = false)
    private String itemName;

    @Column(name = "IS_CHECKED")
    private Long   isChecked;
}