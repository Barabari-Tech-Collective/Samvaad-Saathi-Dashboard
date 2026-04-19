"use client"

import { api } from "@/lib/api/config"

export type Todo = {
  id: string
  title: string
  completed: boolean
}

export type NewTodo = Pick<Todo, "title">
export type UpdateTodoInput = Partial<Omit<Todo, "id">> & { id: string }

export function useTodos() {
  const query = api.useQuery<Todo[]>({
    url: "/todos",
    method: "GET",
    key: ["todos"],
  })

  return {
    todos: query.data ?? [],
    isTodoLoading: query.isLoading,
    ...query,
  }
}

export function useCreateTodo() {
  const { mutate, isPending, ...rest } = api.useMutation<
    Todo,
    unknown,
    NewTodo
  >({
    url: "/todos",
    method: "POST",
    keyToInvalidate: ["todos"],
  })

  return {
    createTodo: mutate,
    isCreatingTodo: isPending,
    ...rest,
  }
}

export function useUpdateTodo() {
  const { mutate, isPending, ...rest } = api.useMutation<
    Todo,
    unknown,
    UpdateTodoInput
  >({
    url: (variables) => `/todos/${variables.id}`,
    method: "PATCH",
    keyToInvalidate: ["todos"],
  })

  return {
    updateTodo: mutate,
    isUpdatingTodo: isPending,
    ...rest,
  }
}

export function useDeleteTodo() {
  const { mutate, isPending, ...rest } = api.useMutation<
    void,
    unknown,
    { id: string }
  >({
    url: (variables) => `/todos/${variables.id}`,
    method: "DELETE",
    keyToInvalidate: ["todos"],
  })

  return {
    deleteTodo: mutate,
    isDeletingTodo: isPending,
    ...rest,
  }
}
