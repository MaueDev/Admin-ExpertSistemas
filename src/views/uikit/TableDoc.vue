<script setup>
import axiosExpertAuth from '@/service/axiosAuth';
import { FilterMatchMode, FilterOperator } from '@primevue/core';
import { onBeforeMount, ref } from 'vue';

const contatos = ref(null);
const filters = ref(null);
const loading = ref(true);

onBeforeMount(async () => {
    axiosExpertAuth.get('/contatos').then((response) => {
        contatos.value = response.data;
        loading.value = false;
        contatos.value.forEach((contato) => {
            contato.criadoEm = new Date(contato.criadoEm);
        });
    });

    initFilters();
});

function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nome: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        telefone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        empresa: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        cpfCnpj: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        localizacao: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        criadoEm: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
}

function formatDate(value) {
    return value.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Contatos</div>
        <DataTable :value="contatos" :paginator="true" :rows="20" dataKey="id" :rowHover="true"
            v-model:filters="filters" filterDisplay="menu" :loading="loading"
            :globalFilterFields="['nome', 'empresa', 'email', 'telefone', 'localizacao']" showGridlines>
            <template #header>
                <div class="flex justify-between">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Pesquisar contatos" />
                    </IconField>
                </div>
            </template>
            <template #empty> Nenhum contato encontrado. </template>
            <template #loading> Carregando dados... </template>

            <Column field="nome" header="Nome" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.nome }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Filtrar nome" />
                </template>
            </Column>
            <Column field="cpfCnpj" header="CNPJ/CPF" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.cpfCnpj }}
                </template>
            </Column>
            <Column field="empresa" header="Empresa" style="min-width: 14rem">
                <template #body="{ data }">
                    {{ data.empresa }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Filtrar empresa" />
                </template>
            </Column>
            <Column field="email" header="E-mail" style="min-width: 14rem">
                <template #body="{ data }">
                    {{ data.email }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Filtrar e-mail" />
                </template>
            </Column>
            <Column field="telefone" header="Telefone" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.telefone }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Filtrar telefone" />
                </template>
            </Column>
            <Column header="Localização" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.localizacao }}
                </template>
            </Column>
            <Column header="Data de Contato" filterField="criadoEm" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.criadoEm) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
