package com.oracle.tripRoad.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {
	
	// application.yml
	@Value("${com.oracle.tripRoad.upload.path}")
	private String uploadPath;
	
	// Construct 수행이후 바로 수행 
	@PostConstruct
	public void init() {
		File tempFolder = new File(uploadPath);
		if(tempFolder.exists() == false) {
			// upload Folder 가 없으면 만들어 줘
			tempFolder.mkdir();
		}
		uploadPath = tempFolder.getAbsolutePath();
		log.info("---------- CustomFileUtil uploadPath----------");
		log.info(uploadPath);		
	}
	
	public List<String> saveFiles(List<MultipartFile> files) {
		if(files == null || files.size() == 0){
			return null;
		}
		List<String> uploadNames = new ArrayList<>();
		for(MultipartFile multipartFile : files) {
			
			// 파일 이름이 없으면 continue
		    if(multipartFile.getOriginalFilename() == null || multipartFile.getOriginalFilename().equals("")){
		      continue;
		    }
	        String savedName = 
	        	UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
	        
	        // 자바에서 파일 저장 경로를 만드는 역할
	        Path savePath = Paths.get(uploadPath, savedName);
	        System.out.println("upLoad saveFiles savedName->"+savedName);
	        
	        try {
	        	// upLoad
				Files.copy(multipartFile.getInputStream(), savePath);
				String contentType = multipartFile.getContentType();
				if (contentType != null && contentType.startsWith("image")) {
					// 적당크기의 size 이미지로 재편성 
					Path  thumbnailPath = Paths.get(uploadPath, "s_"+savedName);
					
					Thumbnails.of(savePath.toFile())
							  .size(400, 400)	
							  .toFile(thumbnailPath.toFile());
				}
				uploadNames.add(savedName);
				
			} catch (IOException e) {
		          throw new RuntimeException(e.getMessage());
			}
		}  // end-For
		return uploadNames;
	}
	
	public String saveProductImage(MultipartFile file) {
	    if (file == null || file.isEmpty()) {
	        return null;
	    }

	    if (file.getOriginalFilename() == null || file.getOriginalFilename().equals("")) {
	        return null;
	    }

	    String savedName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

	    Path productImageFolder = Paths.get(uploadPath, "productImage");

	    try {
	        Files.createDirectories(productImageFolder);

	        Path savePath = Paths.get(uploadPath, "productImage", savedName);
	        Files.copy(file.getInputStream(), savePath);

	        String contentType = file.getContentType();
	        if (contentType != null && contentType.startsWith("image")) {
	            Path thumbnailPath = Paths.get(uploadPath, "productImage", "s_" + savedName);

	            Thumbnails.of(savePath.toFile())
	                      .size(400, 400)
	                      .toFile(thumbnailPath.toFile());
	        }

	        return savedName;

	    } catch (IOException e) {
	        throw new RuntimeException(e.getMessage());
	    }
	}
	
	public List<String> saveUserProfileImages(List<MultipartFile> files) {
		if (files == null || files.size() == 0) {
			return null;
		}

		List<String> uploadNames = new ArrayList<>();
		Path userProfileImageFolder = Paths.get(uploadPath, "userProfileImage");

		try {
			Files.createDirectories(userProfileImageFolder);

			for (MultipartFile multipartFile : files) {
				if (multipartFile == null || multipartFile.isEmpty()) {
					continue;
				}

				if (multipartFile.getOriginalFilename() == null || multipartFile.getOriginalFilename().equals("")) {
					continue;
				}

				String savedName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
				Path savePath = Paths.get(uploadPath, "userProfileImage", savedName);

				Files.copy(multipartFile.getInputStream(), savePath);

				String contentType = multipartFile.getContentType();
				if (contentType != null && contentType.startsWith("image")) {
					Path thumbnailPath = Paths.get(uploadPath, "userProfileImage", "s_" + savedName);

					Thumbnails.of(savePath.toFile())
							  .size(400, 400)
							  .toFile(thumbnailPath.toFile());
				}

				uploadNames.add(savedName);
			}

			return uploadNames;

		} catch (IOException e) {
			throw new RuntimeException(e.getMessage());
		}
	}
	
	public void deleteFiles(List<String> fileNames) {
	    if(fileNames == null || fileNames.size() == 0){
		   return;
		}
	    
    	System.out.println("deleteFiles fileNames->"+fileNames);
	    fileNames.forEach(fileName->{
		   // 썸네일이 있는지 확인하고 삭제 
	    	String  thumbnailFileName = "s_"+fileName;
	    	Path	thumbnailPath     = Paths.get(uploadPath, thumbnailFileName);
	    	Path    filePath          = Paths.get(uploadPath, fileName);
	    	System.out.println("deleteFiles fileName->"+fileName);
	    	try {
	    		Files.deleteIfExists(filePath);
	    		Files.deleteIfExists(thumbnailPath);
			} catch (IOException e) {
				throw new RuntimeException(e.getMessage());
			}
	    	
	    });
		
	}

	// 파일 요청에 대해 서버에 있는 해당 파일을 찾아 Content-Type 헤더와 함께 안전하게 내려주는 기능
	// 없으면 기본 이미지
	public ResponseEntity<Resource> getFile(String fileName) {
        // 입력받은 fileName을 이용해 서버 내 저장 경로인 uploadPath와 결합해 Resource 객체를 생성
	    Resource resource = new FileSystemResource(uploadPath+ File.separator + fileName);
        
	    System.out.println("ResponseEntity<Resource> getFile->"+
	              uploadPath+ File.separator + fileName);
	    
	    if(!resource.exists()) {
	    	// File.separator --> os에 맞는 경로 구분자
	    	// 요청 파일 없으면 default.jpeg 보여줘
	      resource = new FileSystemResource(uploadPath+ File.separator + "default.jpeg");
	    }

	    // 응답 Header 생성후 Content-Type 적용
	    HttpHeaders headers = new HttpHeaders();

	    try{
	        headers.add("Content-Type", Files.probeContentType( resource.getFile().toPath() ));
	    } catch(Exception e){
	        return ResponseEntity.internalServerError().build();
	    }
	    // 최종    : 200 상태코드 +  응답 Header + 파일 Resource 전달
	    // 주요 목적 : File D/L 또는 Image 보여줄때
	    return ResponseEntity.ok().headers(headers).body(resource);
	}
	
	public ResponseEntity<Resource> getUserProfileImage(String fileName) {
		Resource resource = new FileSystemResource(uploadPath + File.separator + "userProfileImage" + File.separator + fileName);

		if (!resource.exists()) {
			resource = new FileSystemResource(uploadPath + File.separator + "default.jpeg");
		}

		HttpHeaders headers = new HttpHeaders();

		try {
			headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}

		return ResponseEntity.ok().headers(headers).body(resource);
	}
	
	
	

}
