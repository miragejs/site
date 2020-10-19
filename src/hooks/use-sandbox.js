import { useMutation } from "urql"

export function useSandbox() {
  const CreateSandbox = `
    mutation ($object: sandboxes_insert_input!) {
      insert_sandboxes_one(object: $object) {
        id
        id2
        browser_id
        config
        method
        request_body
        url
      }
    }
  `
  const [, createSandbox] = useMutation(CreateSandbox)

  const UpdateSandbox = `
    mutation ($id: Int!, $object: sandboxes_set_input!) {
      update_sandboxes_by_pk(pk_columns: {id: $id}, _set: $object) {
        id
        id2
        browser_id
        config
        method
        request_body
        url
      }
    }
  `
  const [, updateSandbox] = useMutation(UpdateSandbox)

  return { createSandbox, updateSandbox }
}
