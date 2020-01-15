<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <Card class="component-card-tag">
    <h4 slot="title">{{tag.name}}</h4>
    <div class="card-tag-desc">{{tag.description}}</div>
  </Card>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'component-card-tag',
    props: ['tag']
  }
</script>
