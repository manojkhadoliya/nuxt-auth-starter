<template>
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
      <form action="" class="space-y-6" @submit.prevent="onSubmit" >
       <!-- Input component go here -->
       <Input
        :disabled="isLoading"
        required
        id="name"
        label="Name"
        name="name"
        v-model="name"
        type="text"
        v-if="variant === 'REGISTER'"
       />
       <Input
        :disabled="isLoading"
        required
        id="email"
        label="Email"
        name="email"
        v-model="email"
        type="email"
       />
       <Input
        :disabled="isLoading"
        required
        id="password"
        label="Password"
        name="password"
        v-model="password"
        type="password"
       />
       <div>
        <Button
        :disabled="isLoading"
        fullWidth
        type="submit"
        >
          {{ variant === 'REGISTER' ? 'Register' : 'Login' }}
        </Button>
       </div>
       <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="bg-white px-2 text-gray-500"> Or Continue with </span>
            </div>
          </div>
          <div class="mt-6 flex gap-2">
            <AuthSocialButton @click="socialAction('github')" icon="bi:github" />
            <AuthSocialButton @click="socialAction('google')" icon="bi:google" />
          </div>
        </div>
        <div class="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div @click="toggleVariant">
            {{
              variant === 'REGISTER' ? 'Already have an account?' : 'New to Messenger?'
            }}
          </div>
          <div @click="toggleVariant" class="underline cursor-pointer">
            {{ variant === 'LOGIN' ? 'Create an account' : 'Login' }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')

const { signIn } = useAuth()

type VARIANT = 'LOGIN' | 'REGISTER'
const variant = ref<VARIANT>('REGISTER')
const onSubmit = async() => {
  isLoading.value = true
  try {
    if (variant.value === 'REGISTER') {
      // Register user
      const user = {
        name: name.value,
        email: email.value,
        password: password.value
      };
      const { data, error } = await useFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(user)
      })
      if (error.value) {
        console.error(error)
      } else {
        console.log('Registration Successful, user', data.value)
      }
    } else {
      const user = {
        email: email.value,
        password: password.value
      };
      const result = await signIn('credentials', {
        redirect: false,
        email: user.email,
        password: user.password
      });
      if (result?.ok && !result.error) {
        console.log('Login Successful, user', result)
      } else {
        console.error('Something went wrong, please try again.')
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }

}

const socialAction = async (action: string) => {
  isLoading.value = true
  try {

    await  signIn(action, { redirect: false })

  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const toggleVariant =() => {
  variant.value = variant.value === 'REGISTER' ? 'LOGIN' : 'REGISTER'
}
</script>

<style scoped>

</style>