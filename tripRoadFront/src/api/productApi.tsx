import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/products`;

// 상품 목록 조회 (백엔드는 배열을 반환하므로 프론트에서 페이지 처리)
export const getList = async (pageParam: PageParam): Promise<ProductListDto[]> => {
    console.log("product getList called with pageParam:", pageParam);
    const response = await axios.get(`${prefix}`, {
        params: { page: pageParam.page, size: pageParam.size }
    });
    console.log("product getList response:", response);

    return response.data;
};

// 전체 상품 목록 조회
export const getAllProducts = async (): Promise<ProductListDto[]> => {
    console.log("product getAllProducts called");
    const response = await axios.get(`${prefix}`);
    console.log("product getAllProducts response:", response);

    return response.data;
};

// 테마별 상품 목록 조회
export const getProductsByTheme = async (themeCode: number): Promise<ProductListDto[]> => {
    console.log("product getProductsByTheme called with themeCode:", themeCode);
    
    const response = await axios.get(`${prefix}/theme`, {
        params: { themeCode: themeCode }
    });
    console.log("product getProductsByTheme response:", response);

    return response.data;
};

// 상품 검색
export const searchProduct = async (keyword: string): Promise<ProductListDto[]> => {
    console.log("product searchProduct called with keyword:", keyword);
    
    const response = await axios.get(`${prefix}/search`, {
        params: { keyword: keyword }
    });
    console.log("product searchProduct response:", response);

    return response.data;
};

// 상품 상세 조회
export const getOne = async (productId: number | string): Promise<ProductDetailDto> => {
    console.log("product getOne called with productId:", productId);
    
    const response = await axios.get(`${prefix}/${productId}`);
    console.log("product getOne response:", response);

    return response.data;
};

// 테마 목록 조회
export const getThemes = async (): Promise<Theme[]> => {
    console.log("product getThemes called");
    
    const response = await axios.get(`${prefix}/themes`);
    console.log("product getThemes response:", response);

    return response.data;
};

// 상품별 후기 목록 조회
export const getReviews = async (productId: number | string): Promise<ProductReviewDto[]> => {
    const response = await axios.get(`${prefix}/${productId}/reviews`);
    return response.data;
};
