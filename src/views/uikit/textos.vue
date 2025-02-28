<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Textarea from 'primevue/textarea';
import axiosExpertAuth from '@/service/axiosAuth';
import { ref, onBeforeMount } from 'vue';
import { useToast } from 'primevue';

const sections = ref([]);
const expandedRows = ref([]);
const editingRows = ref([]);
const toast = useToast();
onBeforeMount(async () => {
    try {
        const response = await axiosExpertAuth.get('/texto-editavel');
        sections.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
});

import Toast from 'primevue/toast';

const onRowEditSave = async (event) => {
    try {
        toast.add({ severity: 'info', summary: 'Atualizando...', detail: 'Aguarde enquanto os dados são salvos.', life: 2000 });

        const { newData, data } = event;
        const { data: dataRequest } = await axiosExpertAuth.put('/texto-editavel', newData);

        data.image = dataRequest.image;
        data.section = dataRequest.section;
        data.sub_texto = dataRequest.sub_texto;
        data.tag = dataRequest.tag;
        data.texto = dataRequest.texto;

        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Dados atualizados com sucesso!', life: 3000 });

    } catch (error) {
        let errorMessage = error.response?.data?.message || error.message || 'Erro inesperado.';
        toast.add({ severity: 'error', summary: 'Erro ao atualizar', detail: errorMessage, life: 3000 });
    }
};

</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Textos Editáveis</div>
        <DataTable v-model:expandedRows="expandedRows" :value="sections" dataKey="section" tableStyle="min-width: 50rem">
            <Column expander style="width: 5rem" />
            <Column field="section" header="Seção"></Column>

            <template #expansion="slotProps">
                <DataTable v-model:editingRows="editingRows" :value="slotProps.data.items" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" tableStyle="min-width: 50rem">
                    <Column field="tag" header="Tag" style="width: 15%"></Column>
                    <Column field="texto" header="Texto" style="width: 50%">
                        <template #editor="{ data, field }">
                            <Textarea v-model="data[field]" autoResize rows="5" style="width: 100%" />
                        </template>
                    </Column>
                    <Column field="sub_texto" header="Subtexto" style="width: 50%">
                        <template #editor="{ data, field }">
                            <Textarea v-model="data[field]" autoResize rows="5" style="width: 100%" />
                        </template>
                    </Column>
                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                </DataTable>
            </template>
        </DataTable>
    </div>
</template>
