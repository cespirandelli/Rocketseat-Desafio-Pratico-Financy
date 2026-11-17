import { gql } from '@apollo/client'

export const LIST_CATEGORIES = gql`
  query ListCategories {
    categories {
      id
      title
      description
      icon
      color
      transactionsCount
      totalAmount
    }
  }
`

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $data: UpdateCategoryInput!) {
    updateCategory(id: $id, data: $data) {
      id
      title
      description
      icon
      color
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`
