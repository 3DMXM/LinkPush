<script lang='ts' setup>
import { computed } from "vue";

const props = defineProps<{
    value: boolean,
    title: string,
    message: string,
    cancelText: string,
    confirmText: string,
}>()

const emit = defineEmits(['update:value', 'cancel', 'confirm'])

let visible = computed({
    get: () => props.value,
    set: (val) => emit('update:value', val)
})

</script>
<template>
    <el-dialog v-model="visible" :title="title" width="30%">
        <span>{{ message }}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="$emit('cancel')">{{ cancelText }}</el-button>
                <el-button type="primary" @click="$emit('confirm')">
                    {{ confirmText }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script lang='ts'>

export default {
    name: 'Dialog',
}
</script>
<style lang='less' scoped>

</style>