<template>
  <div class="card shadow-sm h-100">
    <div class="card-header bg-info text-white">
      <h2 class="mb-0">Book Management</h2>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <div class="form-text text-light">Filter: ISBN > 1000 | Sort: ISBN desc | Limit: 10</div>
        <button 
          class="btn btn-light btn-sm"
          @click="fetchBooks"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
          {{ isLoading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </div>
    <div class="card-body">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading books...</p>
      </div>
      
      <div v-else>
        <div v-if="books.length === 0" class="text-center py-4">
          <div class="display-4 text-muted">
            <i class="bi bi-book"></i>
          </div>
          <p class="h5 mt-3">No books found</p>
          <p class="text-muted">Add books with ISBN > 1000 to see them here</p>
        </div>
        
        <ul v-else class="list-group">
          <li v-for="book in books" :key="book.id" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-1">{{ book.name }}</h5>
                <span class="badge bg-primary fs-6">ISBN: {{ book.isbn }}</span>
              </div>
              <div class="btn-group">
                <button 
                  class="btn btn-sm btn-outline-warning"
                  @click="startEditing(book)"
                >
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(book)"
                >
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
            
            <!-- 编辑表单 (展开模式) -->
            <div v-if="editingBookId === book.id" class="mt-3">
              <div class="mb-2">
                <label class="form-label">ISBN</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="editForm.isbn"
                >
              </div>
              <div class="mb-2">
                <label class="form-label">Book Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="editForm.name"
                >
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button 
                  class="btn btn-sm btn-secondary"
                  @click="cancelEditing"
                >
                  Cancel
                </button>
                <button 
                  class="btn btn-sm btn-success"
                  @click="updateBook(book.id)"
                  :disabled="isUpdating"
                >
                  <span v-if="isUpdating" class="spinner-border spinner-border-sm me-1"></span>
                  Save Changes
                </button>
              </div>
            </div>
          </li>
        </ul>
        
        <div class="mt-3 d-flex justify-content-between align-items-center">
          <div class="text-muted">
            Showing {{ books.length }} of {{ totalBooks }} books
          </div>
          <div v-if="lastUpdated" class="text-muted small">
            Last updated: {{ lastUpdated }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="modal-backdrop fade show"></div>
    <div 
      v-if="showDeleteModal" 
      class="modal fade show d-block" 
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this book?</p>
            <p class="fw-bold">"{{ deleteBookData.name }}" (ISBN: {{ deleteBookData.isbn }})</p>
            <p class="text-danger">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="deleteBook"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1"></span>
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);
    const isLoading = ref(true);
    const lastUpdated = ref('');
    const error = ref('');
    const totalBooks = ref(0);
    const editingBookId = ref(null);
    const editForm = ref({ isbn: '', name: '' });
    const isUpdating = ref(false);
    const showDeleteModal = ref(false);
    const deleteBookData = ref({ id: '', name: '', isbn: '' });
    const isDeleting = ref(false);
    
    // 获取图书数据（使用高级查询）
    const fetchBooks = async () => {
      isLoading.value = true;
      error.value = '';
      
      try {
        // 创建高级查询：ISBN > 1000, 按ISBN降序排序, 限制10条结果
        const q = query(
          collection(db, 'books'),
          where('isbn', '>', 1000),
          orderBy('isbn', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        books.value = [];
        
        querySnapshot.forEach((doc) => {
          books.value.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // 获取图书总数（仅用于显示）
        const allBooksSnapshot = await getDocs(collection(db, 'books'));
        totalBooks.value = allBooksSnapshot.size;
        
        // 更新最后更新时间
        lastUpdated.value = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (err) {
        console.error('Error fetching books: ', err);
        error.value = 'Failed to load books. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    // 开始编辑图书
    const startEditing = (book) => {
      editingBookId.value = book.id;
      editForm.value = {
        isbn: book.isbn.toString(),
        name: book.name
      };
    };
    
    // 取消编辑
    const cancelEditing = () => {
      editingBookId.value = null;
      editForm.value = { isbn: '', name: '' };
    };
    
    // 更新图书信息
    const updateBook = async (bookId) => {
      isUpdating.value = true;
      
      try {
        // 验证ISBN
        const isbnNumber = Number(editForm.value.isbn);
        if (isNaN(isbnNumber)) {
          throw new Error('ISBN must be a valid number');
        }
        
        // 更新Firestore文档
        const bookRef = doc(db, 'books', bookId);
        await updateDoc(bookRef, {
          isbn: isbnNumber,
          name: editForm.value.name
        });
        
        // 更新本地数据
        const bookIndex = books.value.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
          books.value[bookIndex] = {
            ...books.value[bookIndex],
            isbn: isbnNumber,
            name: editForm.value.name
          };
        }
        
        // 重置编辑状态
        editingBookId.value = null;
      } catch (err) {
        console.error('Error updating book: ', err);
        error.value = err.message || 'Failed to update book.';
      } finally {
        isUpdating.value = false;
      }
    };
    
    // 确认删除
    const confirmDelete = (book) => {
      deleteBookData.value = {
        id: book.id,
        name: book.name,
        isbn: book.isbn
      };
      showDeleteModal.value = true;
    };
    
    // 删除图书
    const deleteBook = async () => {
      isDeleting.value = true;
      
      try {
        // 从Firestore删除
        await deleteDoc(doc(db, 'books', deleteBookData.value.id));
        
        // 从本地列表中移除
        books.value = books.value.filter(b => b.id !== deleteBookData.value.id);
        totalBooks.value--;
        
        // 关闭模态框
        showDeleteModal.value = false;
      } catch (err) {
        console.error('Error deleting book: ', err);
        error.value = 'Failed to delete book. Please try again.';
      } finally {
        isDeleting.value = false;
      }
    };
    
    onMounted(() => {
      fetchBooks();
    });
    
    return {
      books,
      isLoading,
      lastUpdated,
      error,
      totalBooks,
      editingBookId,
      editForm,
      isUpdating,
      showDeleteModal,
      deleteBookData,
      isDeleting,
      fetchBooks,
      startEditing,
      cancelEditing,
      updateBook,
      confirmDelete,
      deleteBook
    };
  }
};
</script>

<style scoped>
.list-group-item {
  border: none;
  border-bottom: 1px solid rgba(0,0,0,0.125);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s;
  padding: 1rem;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.badge {
  border-radius: 12px;
  padding: 0.5em 0.8em;
  font-weight: 600;
}

.card {
  border-radius: 10px;
}

.btn-group .btn {
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
}

.modal-backdrop {
  opacity: 0.5;
  background-color: #000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1040;
}

.modal {
  z-index: 1050;
}
</style>