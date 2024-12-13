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

  GET_PRODUCTS_BY_COVER_GUID: gql`
    query GetProduct($ContentGuid: String!) {
      ECProducts_V1(where: { cover: { assetGuid: { eq: $ContentGuid } } }) {
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
  `,

  SEARCH_IMAGE_QUERY: gql`
  query SearchImage($labelGroupName: String!) {
    PublicImageAsset(
      where: {
        Labels: { Group: { Name: { startsWith: $labelGroupName } } } 
      }
      orderBy: { DateModified: DESC }
    ) {
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
        Labels {
          Group {
            Id
            Name
          }
          Values {
            Id
            Name
          }
        }
      }
    }
  }
`,
SEARCH_ALL_IMAGE_QUERY: gql`
query GetImage {
  PublicImageAsset(orderBy: { DateModified: DESC }) {
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
      Labels {
        Group {
          Id
          Name
        }
        Values {
          Id
          Name
        }
      }
      MimeType
      LibraryPath
      Tags {
        Guid
        Name
      }
    }
  }
}
`
};

export const fetchImageUrl = (assetGuid: string) => {
  return `https://images.cmp.optimizely.com/${assetGuid}`;
}; 
