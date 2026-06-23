package com.oracle.tripRoad.domain.checklist;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "CHECKLIST")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Checklist {
	
	@Id
	@GeneratedValue(
	    strategy = GenerationType.SEQUENCE,
	    generator = "checklist_seq_generator"
	)
	@SequenceGenerator(
	    name = "checklist_seq_generator",
	    sequenceName = "CHECKLIST_SEQ",
	    allocationSize = 1
	)
	@Column(name = "CHECKLIST_ID")
	private Long checklistId;
	
	@Column(name = "BOOKING_ID")
	private Long bookingId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @Column(name = "TITLE", length = 100, nullable = false)
    private String title;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
    
    @Column(name = "PRODUCT_ID")
    private Long productId;

}
