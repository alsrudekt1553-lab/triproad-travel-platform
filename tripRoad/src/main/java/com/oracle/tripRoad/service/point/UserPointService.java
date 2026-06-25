package com.oracle.tripRoad.service.point;

import com.oracle.tripRoad.dto.point.UserPointDto;
import com.oracle.tripRoad.exception.InsufficientPointException;

import java.util.List;

public interface UserPointService {

    void deductPoint(Long userId, int amount, Long bookingId);

    void refundPoint(Long userId, int amount, Long bookingId);

    UserPointDto.Balance getBalance(Long userId);

    List<UserPointDto.History> getHistory(Long userId);

    void expirePoints();

}