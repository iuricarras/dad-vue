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

// Valores a enviar
const credentials = ref({
  })

const cancel = () => {
    //router.back()
    router.push('/users')
}

// cria o user para o servidor
const create = async () => {
  const jsonToSend = credentials.value
  console.log("!!!JSON!!!", jsonToSend)
  await storeUser.createAdmin(jsonToSend)
  router.push('/users')
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
// os browsers ignorão o (autocomplete="off")
const disabled = ref(true);

onMounted(() => {
  setTimeout(() => {
    disabled.value = false; // Ativa os campos após um curto intervalo
  }, 500); // 500ms é suficiente para evitar
})


</script>


<template>
  <Card v-show="storeAuth.user.type === 'A'" class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Criar Administrador</CardTitle>
      <CardDescription>Insira os seus dados.</CardDescription>
    </CardHeader>
    <CardContent>

      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" :disabled="disabled"/>
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input id="nickname" type="nickname" placeholder="Nickname" v-model="credentials.nickname" :disabled="disabled"/>
            <ErrorMessage :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input id="name" type="name" placeholder="Name" v-model="credentials.name" :disabled="disabled"/>
            <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
          </div>


          <!-- upload e preview da foto -->
          <Label for="photo">Photo</Label>
          <div class="drag-and-drop flex flex-col space-y-1.5"
          @dragover.prevent 
          @dragleave.prevent 
          @drop.prevent="onDrop">

          <p>Arraste e solte uma imagem aqui.</p>
            <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            ref="fileInput"
            style="display: none;"
            :disabled="disabled" />

            <img v-if="imagePreview" :src="imagePreview" alt="Preview da imagem" />

            <button type="button" @click="triggerFileInput" 
            class="bg-black text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-800">
            Selecionar Imagem</button>
          </div>


          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" v-model="credentials.password" :disabled="disabled"/>
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="cancel">
            Cancel
        </Button>
        <Button @click="create">
            Register
        </Button>
    </CardFooter>
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