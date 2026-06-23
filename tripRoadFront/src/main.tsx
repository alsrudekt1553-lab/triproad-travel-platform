import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router/root'

// 라우터 제공자 중 하나로 모든 데이터 라우팅 요소는 RouterProvider에 전달
// RouterProvider를 통해 라우터 설정을 적용한 React 앱을 랜더링
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}></RouterProvider>
)
