<template>
  <div class="simple-api-page">
    <div class="header">
      <h1>Books API</h1>
      <p>Displaying all books in JSON format</p>
      
      <button class="refresh-btn" @click="fetchBooks">
        <i class="bi bi-arrow-repeat"></i> Refresh Data
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading books data...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button class="try-again-btn" @click="fetchBooks">
        Try Again
      </button>
    </div>
    
    <div v-else class="json-view">
      <pre>{{ formattedJSON }}</pre>
    </div>
    
    <div class="api-info">
      <p>This page displays all books in JSON format. Total books: {{ books.length }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase/init.js';

export default {
  name: 'GetAllBookAPI',
  setup() {
    const books = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // 获取所有书籍数据
    const fetchBooks = async () => {
      loading.value = true;
      error.value = null;
      books.value = [];
      
      try {
        // 从Firestore获取所有书籍
        const querySnapshot = await getDocs(collection(db, 'books'));
        const booksArray = [];
        
        querySnapshot.forEach((doc) => {
          booksArray.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        books.value = booksArray;
        
      } catch (err) {
        console.error('Error fetching books:', err);
        error.value = 'Failed to load books data. Please try again later.';
      } finally {
        loading.value = false;
      }
    };

    // 格式化的JSON数据
    const formattedJSON = computed(() => {
      if (!books.value.length) return 'No books found';
      
      const apiResponse = {
        success: true,
        timestamp: new Date().toISOString(),
        totalBooks: books.value.length,
        books: books.value
      };
      
      return JSON.stringify(apiResponse, null, 2);
    });

    // 生命周期钩子
    onMounted(() => {
      fetchBooks();
    });

    return {
      books,
      loading,
      error,
      fetchBooks,
      formattedJSON
    };
  }
};
</script>

<style scoped>
.simple-api-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.header p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.refresh-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.refresh-btn:hover {
  background-color: #2980b9;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.loading .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  background-color: #ffecec;
  border: 1px solid #ffbdbd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error p {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.try-again-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.try-again-btn:hover {
  background-color: #c0392b;
}

.json-view {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  max-height: 60vh;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.api-info {
  margin-top: 1rem;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>