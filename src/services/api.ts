import { gql } from '@apollo/client';

export const QUERIES = {
  GET_ALL_PRODUCTS: gql`
    query GetAllProducts {
      ECProducts_V1(orderBy: { id: DESC }) {
        total
        items {
          ContentGuid
          id
          price
          productDescription
          productTitle
          publishDate
          cover {
            assetGuid
            assetType
          }
        }
      }
    }
  `,

  GET_PRODUCT: gql`
    query GetProduct($ContentGuid: String!) {
      ECProducts_V1(where: { ContentGuid: { eq: $ContentGuid } }) {
        items {
          ContentGuid
          id
          price
          productDescription
          productTitle
          publishDate
          cover {
            assetGuid
            assetType
          }
        }
      }
    }
  `,

  GET_IMAGE: gql`
    query GetImage($assetGuid: String!) {
      PublicImageAsset(where: { Id: { eq: $assetGuid } }) {
        items {
          Id
          Title
          Url
          Renditions {
            Name
            Url
            Height
            Width
          }
        }
      }
    }
  `
};

export const fetchImageUrl = (assetGuid: string) => {
  return `https://images.cmp.optimizely.com/${assetGuid}`;
}; 
