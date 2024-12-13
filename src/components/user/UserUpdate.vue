<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()
const storeUser = useUserStore()

const showDeleteForm = ref(false);
const showDeleteForm_View = () =>{
  showDeleteForm.value = !showDeleteForm.value;
}


// Valores a enviar
const credentials = ref({
  })
const credentials_delete = ref({
  })

const cancel = () => {
    router.back()
}

// atualiza o user para o servidor
const update = async () => {
  const jsonToSend = credentials.value
  console.log("!!!JSON!!!", storeAuth.id, jsonToSend)
  await storeUser.updateUserAll(storeAuth.id, jsonToSend)
  router.back()
}

// apagar o user no servidor
const deleteUser = async () => {
  const jsonToSend = credentials_delete.value
  storeAuth.logout()
}


// funções do drag-and-drop da foto, até ao comentário vazio
const imagePreview = ref(null)
const fileInput = ref(null)

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    createPreview(file)
  }
}

const onDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    createPreview(file)
  }
}

const createPreview = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    credentials.value.photo = reader.result // guarda a imagem no credentials acima
    imagePreview.value = reader.result // atualiza o preview
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value.click()
}
//

// desativa os Input's temporariamente para evitar o preenchimento automático
// os browsers ignoram o (autocomplete="off")
const disabled = ref(true);

onMounted(() => {
  setTimeout(() => {
    disabled.value = false; // Ativa os campos após um curto intervalo
  }, 500); // 500ms é suficiente para evitar
})


</script>


<template>
  <div v-if="!storeAuth.user" class="flex justify-center items-center h-screen">
    <h1 class="text-2xl font-bold text-center text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-md">
      O utilizador deve autenticar-se! </h1>
  </div>
  <Card v-show="storeAuth.user" class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Atualizar dados</CardTitle>
      <CardDescription>Atulize os seus dados da sua conta.</CardDescription>
    </CardHeader>
    <CardContent>

      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" :disabled="disabled" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input id="nickname" type="nickname" placeholder="Nickname" v-model="credentials.nickname"
              :disabled="disabled" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input id="name" type="name" placeholder="Name" v-model="credentials.name" :disabled="disabled" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
          </div>


          <!-- upload e preview da foto -->
          <Label for="photo">Photo</Label>
          <div class="drag-and-drop flex flex-col space-y-1.5" @dragover.prevent @dragleave.prevent
            @drop.prevent="onDrop">

            <p>Arraste e solte uma imagem aqui.</p>
            <input type="file" accept="image/*" @change="onFileChange" ref="fileInput" style="display: none;"
              :disabled="disabled" />

            <img v-if="imagePreview" :src="imagePreview" alt="Preview da imagem" />

            <button type="button" @click="triggerFileInput"
              class="bg-black text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-800">
              Selecionar Imagem</button>
          </div>


          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" v-model="credentials.password"
              :disabled="disabled" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline" @click="cancel">
        Cancel
      </Button>
      <Button @click="update">
        Update
      </Button>
    </CardFooter>
    <button v-show="storeAuth.user.type === 'P' " type="button" @click="showDeleteForm_View" class="bg-red-600 text-white py-2
    px-4 rounded-md shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none flex items-center gap-2">
      🗑️ Apagar conta </button>


    <!-- Confirma se o user quer apagar a conta -->
    <div v-if="showDeleteForm" class="fixed inset-0 bg-black bg-opacity-50
      flex items-center justify-center z-50" @click.self="showDeleteForm = false">
      <div class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg
      overflow-hidden" style="max-height: 90vh; overflow-y: auto;">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Tens a certeza que queres continuar? (Esta ação é IRREVERSÍVEL) !!!!!!
          </h3>
          <button @click="showDeleteForm_View" class="text-red-500 font-bold">
            Fechar
          </button>
        </div>

        <!-- verificar password + botão apagar -->
        <div class="flex flex-col space-y-4">
          <div>
            <Label for="password">Password</Label>
            <input id="password" type="password" placeholder="Insira sua senha" v-model="credentials_delete.password"
              :disabled="disabled " autocomplete="new-password"
              class="mt-1 block w-full px-3 py-2 bg-yellow-100 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
          <button @click="deleteUser"
            class="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 font-bold">
            Apagar conta - Faz LogOut por agora
          </button>
        </div>

      </div>
    </div>


  </Card>
</template>


<style>

.drag-and-drop {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.drag-and-drop img {
  max-width: 100%;
  margin-top: 10px;
}
</style>