import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import request from "graphql-request";
import gql from "graphql-tag";

const endpoint = "http://localhost:4000/graphql";
const query = gql`
  query {
    histories {
      id
      queryString
      timestamp
    }
  }
`;

const createHistory = gql`
  mutation CreateHistory($queryString: String!) {
    createHistory(queryString: $queryString) {
      id
      queryString
      timestamp
    }
  }
`;

const clearHistories = gql`
  mutation {
    clearHistories
  }
`;
export const useListHistories = () => {
  return useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      const data = await request(endpoint, query);
      return data;
    },
  });
};

export const useCreateHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createHistory"],
    mutationFn: async (variables: { queryString: string }) => {
      const data = await request(endpoint, createHistory, variables);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
};

export const useClearHistories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clearHistories"],
    mutationFn: async () => {
      const data = await request(endpoint, clearHistories);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
};
