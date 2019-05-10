<template>
  <div class="hello">
    <h4>{{ msg }}</h4>
    <h4>{{ level }}</h4>
    <h4>{{ x }}</h4>
  </div>
</template>

<script>
export default {
  name: 'hello-world',
  props: {
    msg: String,
    level: Number,
  },
  computed: {
    x() {
      return `test : ${this.msg}_${this.level}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
