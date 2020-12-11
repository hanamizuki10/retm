import Vue from 'vue';
import { GoogleScript } from '@/google/script';

declare module 'vue/types/vue' {
  interface Vue {
    $script: GoogleScript;
  }
}
