<template>
  <div>
    <h1>Custom Not Found</h1>
    <p>Route path is {{ $route.path }}</p>
    <p>Route query is {{ $route.query }}</p>
  </div>
</template>

<script>
// for generated, you need http server (S3, GC Storage, etc...) to be able to handle 404 fallback...
export default {
  layout: 'minimal',
  created() {
    // can do redirection here
  }
}
</script>
