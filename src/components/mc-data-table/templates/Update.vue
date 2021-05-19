<template>
    <a href="#" @click.prevent="itemTask(itemData)">
        {{updateLabel}}<i class="fa fa-edit"></i>
    </a>
</template>

<style>

</style>

<script>
    export default {
        name : "Update",
        data() {
            return {
                updateLabel: this.itemLabel || this.$label.update,
            }
        },
        props: {
            itemTask: {
                type    : Function,
                required: true,
            },
            itemData  : {
                type    : Object,
                required: true,
            },
            itemLabel : {
                type   : String,
                default: "",
            }
        },
    }
</script>
