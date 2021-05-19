<template>
    <td>
        <span v-if="isActive">{{yesLabel}} <i class="fa fa-check"></i></span>
        <span v-else>{{noLabel}} <i class="fa fa-power-off"></i></span>
    </td>
</template>
<style>

</style>

<script>
    export default {
        name : "Active",
        data() {
            return {
                yesLabel: this.activeLabel || this.$label.yes,
                noLabel : this.inActiveLabel || this.$label.no,
            }
        },
        props: {
            isActive     : {
                type    : [Boolean, String],
                default : false,
            },
            activeLabel  : {
                type   : String,
                default: "",
            },
            inActiveLabel: {
                type   : String,
                default: "",
            }
        },
    }
</script>
