package com.oracle.tripRoad.controller.formatter;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.format.Formatter;

//  주요 기능은 문자열과 LocalDate 객체 간의 변환을 담당
// 날짜 문자열 ↔ 날짜 객체 변환을 담당하는 사용자 지정 포맷터
public class LocalDateFormatter implements Formatter<LocalDate> {

	// print 메서드는 LocalDate 객체를 "yyyy-MM-dd" 형식의 문자열로 변환
	@Override
	public String print(LocalDate object, Locale locale) {
		// TODO Auto-generated method stub
		return DateTimeFormatter.ofPattern("yyyy-MM-dd").format(object);
	}

	// parse 메서드는 "yyyy-MM-dd" 형식의 문자열을 받아서 LocalDate 객체로 변환
	@Override
	public LocalDate parse(String text, Locale locale) throws ParseException {
		// TODO Auto-generated method stub
		return LocalDate.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
	}

}
