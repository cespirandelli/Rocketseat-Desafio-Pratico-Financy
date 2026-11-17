import { gql } from '@apollo/client'

export const LIST_TRANSACTIONS = gql`
  query ListTransactions($filter: TransactionFilterInput, $pagination: PaginationInput) {
    transactions(filter: $filter, pagination: $pagination) {
      total
      page
      perPage
      totalPages
      items {
        id
        description
        amount
        type
        date
        categoryId
        category {
          id
          title
          icon
          color
        }
      }
    }
  }
`

export const GET_SUMMARY = gql`
  query GetSummary($period: String) {
    summary(period: $period) {
      balance
      monthIncome
      monthExpense
    }
  }
`

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      id
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $data: UpdateTransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      id
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`
