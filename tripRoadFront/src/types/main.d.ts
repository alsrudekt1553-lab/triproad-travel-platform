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
}

interface MainHome {
  themes: MainTheme[]
  recommendProducts: MainProduct[]
  newProducts: MainProduct[]
}