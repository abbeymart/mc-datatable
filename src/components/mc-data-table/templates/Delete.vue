<template>
    <a href="#" @click.prevent="itemTask(itemId)">
        {{deleteLabel}}<i class="fa fa-times-circle"></i>
    </a>
</template>

<style>

</style>

<script>
    export default {
        name : "Delete",
        data() {
            return {
                deleteLabel: this.itemLabel || this.$label.delete,
            }
        },
        props: {
            itemTask: {
                type    : Function,
                required: true,
            },
            itemId    : {
                type    : String,
                required: true,
            },
            itemLabel : {
                type   : String,
                default: "",
            }
        },
    }
</script>
