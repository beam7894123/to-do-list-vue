<script setup>
</script>
<template>
<a-layout class="layout">
<!--<a-layout-header>-->
<!--  <div class="logo" />-->
<!--  <a-menu-->
<!--      theme="dark"-->
<!--      mode="horizontal"-->
<!--      :default-selected-keys="['2']"-->
<!--      :style="{ lineHeight: '64px' }"-->
<!--  >-->
<!--    <a-menu-item key="1">-->
<!--      nav 1-->
<!--    </a-menu-item>-->
<!--    <a-menu-item key="2">-->
<!--      nav 2-->
<!--    </a-menu-item>-->
<!--    <a-menu-item key="3">-->
<!--      nav 3-->
<!--    </a-menu-item>-->
<!--  </a-menu>-->
<!--</a-layout-header>-->
<a-layout-content>
<!--  <a-breadcrumb style="margin: 16px 0">-->
<!--    <a-breadcrumb-item>Home</a-breadcrumb-item>-->
<!--    <a-breadcrumb-item>List</a-breadcrumb-item>-->
<!--    <a-breadcrumb-item>App</a-breadcrumb-item>-->
<!--  </a-breadcrumb>-->
  <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
    <RouterView />
  </div>
</a-layout-content>
<a-layout-footer style="text-align: center">
  <p>Simple Todo list ©2024 Created by BezaTheCat ᗜ ̫ ᗜ </p>
  <p>Create in Vue + Vite + ExpressJS + Ant Design</p>
</a-layout-footer>
</a-layout>
</template>

<style scoped>
</style>
