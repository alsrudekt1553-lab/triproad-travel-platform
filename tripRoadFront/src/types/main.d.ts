interface MainTheme {
  themeCode: number
  themeName: string
}

interface MainProduct {
  productId: number
  productName: string
  price: number
  themeName?: string
  regionId: number
  regionName?: string
  imageName?: string
  averageRating?: number | null
}

interface MainHome {
  themes: MainTheme[]
  recommendProducts: MainProduct[]
  newProducts: MainProduct[]
}