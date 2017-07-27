<template>

    <div>

        <img class="logo" src="./../assets/dragon.png">
        <h1>Dragon</h1>
        <h2>The unlimited javascript drag&drop library</h2>


        <div class="row demo">
            <div
                    class="col-xs-12 col-sm-6 container"
                    v-for="container in containers"
                    :key="container.id"
            >
                <div
                        class="box"
                        v-for="item in container.items"
                        :key="item.id"
                >
                    <p>{{item.text}}</p>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
  import dragon from 'dragon'

  export default {
    name: 'hello',
    computed: {
      containers () {
        return this.$store.state.containers
      },
    },
    mounted () {
      let d = dragon(document.getElementsByClassName('container'))
      console.log('dingdong', d)
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    img.logo {
        max-width: 300px;
    }

    .demo {
        text-align: center;
    }

    .box {
        background: #bdffa3;
    }
</style>
