<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
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
const storeError = useErrorStore()

const credentials = ref({
    email: '',
    nickname: '',
    name: '',
    photo: null,
    password: ''
})

const cancel = () => {
    router.back()
}

const update = () => {
  console.log("Brevemente")
}

</script>

<template>
  <div> email, nickname, name, photo , password </div>
  <Card v-show="storeAuth.user.type=='P' || 'A'" class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Atualizar dados</CardTitle>
      <CardDescription>Atulize os seus dados da sua conta.</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="User Email" v-model="credentials.email" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input id="nickname" type="nickname" placeholder="Nickname" v-model="credentials.nickname" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input id="name" type="name" placeholder="Name" v-model="credentials.name" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="photo">Photo</Label>
            <Input id="photo" type="photo" v-model="credentials.photo" />
            <ErrorMessage :errorMessage="storeError.fieldMessage('photo')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="Password" v-model="credentials.password" />
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
  </Card>
</template>