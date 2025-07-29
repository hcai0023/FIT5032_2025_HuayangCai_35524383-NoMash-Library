<template>
  <div class="container mt-4">
    <div class="row">
      <!-- 添加图书表单 -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h2 class="mb-0">Add New Book</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="isbn" 
                  v-model="isbn" 
                  required
                  placeholder="Enter ISBN number"
                >
                <div v-if="isbnError" class="text-danger mt-1">{{ isbnError }}</div>
              </div>
              
              <div class="mb-3">
                <label for="name" class="form-label">Book Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="name" 
                  required
                  placeholder="Enter book title"
                >
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSubmitting ? 'Adding Book...' : 'Add Book' }}
                </button>
              </div>
              
              <div v-if="addSuccess" class="alert alert-success mt-3">
                <i class="bi bi-check-circle-fill me-2"></i>Book added successfully!
              </div>
              
              <div v-if="addError" class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ addError }}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- 图书列表 -->
      <div class="col-md-6">
        <BookList ref="bookList" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../firebase/init.js';
import { collection, addDoc } from 'firebase/firestore';
import BookList from '../components/BookList.vue';

export default {
  components: {
    BookList
  },
  setup() {
    const isbn = ref('');
    const name = ref('');
    const isSubmitting = ref(false);
    const addSuccess = ref(false);
    const addError = ref('');
    const isbnError = ref('');
    const bookList = ref(null);

    // 验证ISBN格式
    const validateISBN = () => {
      const isbnNumber = Number(isbn.value);
      if (isNaN(isbnNumber)) {
        isbnError.value = 'ISBN must be a valid number';
        return false;
      }
      if (isbnNumber < 0) {
        isbnError.value = 'ISBN must be a positive number';
        return false;
      }
      isbnError.value = '';
      return true;
    };

    const addBook = async () => {
      if (!validateISBN()) return;
      
      isSubmitting.value = true;
      addSuccess.value = false;
      addError.value = '';
      
      try {
        await addDoc(collection(db, 'books'), {
          isbn: Number(isbn.value),
          name: name.value,
        });
        
        // 重置表单
        isbn.value = '';
        name.value = '';
        addSuccess.value = true;
        
        // 刷新图书列表
        if (bookList.value) {
          bookList.value.fetchBooks();
        }
      } catch (error) {
        console.error('Error adding book: ', error);
        addError.value = 'Failed to add book. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      isbn,
      name,
      isSubmitting,
      addSuccess,
      addError,
      isbnError,
      bookList,
      addBook,
      validateISBN
    };
  }
};
</script>

<style scoped>
.card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  font-weight: 600;
}

.form-control {
  border-radius: 8px;
  padding: 12px 15px;
}

.btn {
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.alert {
  border-radius: 8px;
}
</style>