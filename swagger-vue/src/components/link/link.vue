<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div :class="link_class">
    <div class="link-name"><span class="link-type">{{method}}</span><span>{{link.name}}</span></div>
    <div class="link-summary">{{link.summary}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'component-link',
    props: ['link'],
    computed: {
      method () {
        return this.link.type.toUpperCase();
      },
      link_class () {
        const classes = ['component-link'];
        switch (this.method) {
          case 'GET':
            classes.push('link-method-get');
            break;
          case 'PUT':
            classes.push('link-method-put`');
            break;
          case 'DELETE':
            classes.push('link-method-delete');
            break;
          case 'POST':
          default:
            classes.push('link-method-post');
            break;
        }
        if (this.link.selected) {
          classes.push('link-selected');
        }

        return classes.join(' ');
      }
    }
  }
</script>
