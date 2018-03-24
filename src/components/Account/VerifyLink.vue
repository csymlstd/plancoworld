<template>
    <div></div>
</template>

<script>
import auth from '@/services/auth'

export default {
    methods: {
        QueryParam(param) {
            let query = window.location.search.substring(1)
            let vars = query.split("&")
            for (var i=0;i<vars.length;i++) {
                let pair = vars[i].split("=")
                if(pair[0] == param){ return unescape(pair[1]) }
            }
            return(false)
        }
    },
    mounted() {
        let t = this.QueryParam('token')
        if(t) auth.loginLinkVerify(t)
        this.$router.push('/')        
    }
}
</script>