```html
<!-- src/App.vue -->
<template>
  <div v-if="serverError" data-testid="server-error">
    {{ serverError }}
  </div>

  <div v-else-if="users.length === 0" data-testid="no-users">
    No users!
  </div>

  <div v-else>
    <ul id="users">
      <li
        v-for="user in users"
        v-bind:key="user.id"
        :data-testid="'user-' + user.id"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "app",

    data() {
      return {
        users: [],
        serverError: null,
      }
    },

    created() {
      fetch("/api/users")
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            this.serverError = json.error
          } else {
            this.users = json.users
          }
        })
    },
  }
</script>
```
