# Dynamic Route & Custom Error Page

1. Create folder pages/dynamic

2. Create file pages/dynamic/_slug.vue

```
<template>
  <div>
    <h1>DYN {{ $route.params.slug }}</h1>
    <ul>
      <li>
        <nuxt-link to="/">Home</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic">DYN no slug</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/1">DYN -> 1</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/2">DYN -> 2</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/3">DYN -> 3</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/a">DYN -> A (Error must be numeric due to validation)</nuxt-link>
      </li>
    </ul>
    <p>To test dynamic routes with Nuxt Generate</p>
  </div>
</template>

<script>
export default {
    validate ({ params }) {
    // Must be a number
    return /^\d+$/.test(params.slug)
  }
}
</script>
```

3. Do some test on the routes

/dynamic/a

/dynamic/b

/dynamic - potential for error if not handled

/dynamic/a (invalid - validate route params)


4. Create file pages/dynamic/index.vue

- test it out

```
<template>
  <h2>Please include query param...</h2>
</template>
```

5. Create file pages/dynamic.vue

- parent for the dynamic routes
- illustrate use of <nuxt-child> / <nuxtChild>

```
<template>
  <div>
    <h1>Dynamic's Parent</h1>
    <nuxt-child :key="$route.params.slug" />
  </div>
</template>
```
