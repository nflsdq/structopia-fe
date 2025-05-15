const API_URL = "http://localhost:8000/api"

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

// Level API
export async function getLevels() {
  try {
    return await fetchWithAuth("/levels")
  } catch (error) {
    console.error("Error fetching levels:", error)
    return { data: dummyData.levels }
  }
}

export async function getLevelDetail(levelId: number) {
  try {
    return await fetchWithAuth(`/levels/${levelId}`)
  } catch (error) {
    console.error(`Error fetching level ${levelId}:`, error)
    const level = dummyData.levels.find((l) => l.id === levelId) || dummyData.levels[0]
    return { data: { ...level, materials: dummyData.materials.filter((m) => m.level_id === levelId) } }
  }
}

// Material API
export async function getMaterials(levelId: number) {
  try {
    return await fetchWithAuth(`/levels/${levelId}/materials`)
  } catch (error) {
    console.error(`Error fetching materials for level ${levelId}:`, error)
    return { data: dummyData.materials.filter((m) => m.level_id === levelId) }
  }
}

export async function getMaterialDetail(materialId: number) {
  try {
    return await fetchWithAuth(`/materials/${materialId}`)
  } catch (error) {
    console.error(`Error fetching material ${materialId}:`, error)
    return { data: dummyData.materials.find((m) => m.id === materialId) || dummyData.materials[0] }
  }
}

export async function markMaterialAsCompleted(materialId: number) {
  try {
    return await fetchWithAuth(`/materials/${materialId}/complete`, {
      method: "POST",
    })
  } catch (error) {
    console.error(`Error marking material ${materialId} as completed:`, error)
    return { success: true, message: "Material marked as completed (dummy)" }
  }
}

// Quiz API
export async function getQuizzes(levelId: number) {
  try {
    return await fetchWithAuth(`/levels/${levelId}/quizzes`)
  } catch (error) {
    console.error(`Error fetching quizzes for level ${levelId}:`, error)
    return { data: dummyData.quizzes.filter((q) => q.level_id === levelId) }
  }
}

export async function getQuizDetail(quizId: number) {
  try {
    return await fetchWithAuth(`/quizzes/${quizId}`)
  } catch (error) {
    console.error(`Error fetching quiz ${quizId}:`, error)
    return { data: dummyData.quizzes.find((q) => q.id === quizId) || dummyData.quizzes[0] }
  }
}

export async function submitQuizAnswers(quizId: number, answers: { question_id: number; answer: string | string[] }[]) {
  try {
    return await fetchWithAuth(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
  } catch (error) {
    console.error(`Error submitting answers for quiz ${quizId}:`, error)
    // Simulasi hasil quiz
    const quiz = dummyData.quizzes.find((q) => q.id === quizId) || dummyData.quizzes[0]
    const totalQuestions = quiz.questions.length
    const correctAnswers = Math.floor(Math.random() * (totalQuestions + 1)) // Simulasi jawaban benar
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= quiz.passing_score

    return {
      data: {
        quiz_id: quizId,
        user_id: 1,
        score,
        passed,
        completed_at: new Date().toISOString(),
        answers: answers.map((a) => ({
          question_id: a.question_id,
          user_answer: a.answer,
          is_correct: Math.random() > 0.3, // 70% kemungkinan benar
        })),
      },
    }
  }
}

// Progress API
export async function getUserProgress(levelId: number) {
  try {
    return await fetchWithAuth(`/progress/level/${levelId}`)
  } catch (error) {
    console.error(`Error fetching progress for level ${levelId}:`, error)
    return { data: dummyData.progress.find((p) => p.level_id === levelId) || dummyData.progress[0] }
  }
}

// Badge API
export async function getUserBadges() {
  try {
    return await fetchWithAuth(`/badges`)
  } catch (error) {
    console.error("Error fetching badges:", error)
    return { data: dummyData.badges }
  }
}

// Leaderboard API
export async function getLeaderboard(limit = 10) {
  try {
    return await fetchWithAuth(`/leaderboard?limit=${limit}`)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return { data: dummyData.leaderboard }
  }
}

// Admin API
export async function getAdminStats() {
  try {
    return await fetchWithAuth(`/admin/stats`)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return { data: dummyData.adminStats }
  }
}

export async function getAdminUsers(page = 1, limit = 10) {
  try {
    return await fetchWithAuth(`/admin/users?page=${page}&limit=${limit}`)
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return {
      data: dummyData.users,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: dummyData.users.length,
      },
    }
  }
}

export async function createLevel(levelData: Partial<Level>) {
  try {
    return await fetchWithAuth(`/admin/levels`, {
      method: "POST",
      body: JSON.stringify(levelData),
    })
  } catch (error) {
    console.error("Error creating level:", error)
    return {
      success: true,
      data: {
        id: Math.max(...dummyData.levels.map((l) => l.id)) + 1,
        ...levelData,
        status: "locked",
        keterangan: "Level baru",
      },
    }
  }
}

export async function updateLevel(levelId: number, levelData: Partial<Level>) {
  try {
    return await fetchWithAuth(`/admin/levels/${levelId}`, {
      method: "PUT",
      body: JSON.stringify(levelData),
    })
  } catch (error) {
    console.error(`Error updating level ${levelId}:`, error)
    return {
      success: true,
      data: {
        ...dummyData.levels.find((l) => l.id === levelId),
        ...levelData,
      },
    }
  }
}

export async function deleteLevel(levelId: number) {
  try {
    return await fetchWithAuth(`/admin/levels/${levelId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error(`Error deleting level ${levelId}:`, error)
    return { success: true, message: "Level deleted successfully (dummy)" }
  }
}

export async function createMaterial(materialData: Partial<Material>) {
  try {
    return await fetchWithAuth(`/admin/materials`, {
      method: "POST",
      body: JSON.stringify(materialData),
    })
  } catch (error) {
    console.error("Error creating material:", error)
    return {
      success: true,
      data: {
        id: Math.max(...dummyData.materials.map((m) => m.id)) + 1,
        ...materialData,
        status: "unread",
      },
    }
  }
}

export async function updateMaterial(materialId: number, materialData: Partial<Material>) {
  try {
    return await fetchWithAuth(`/admin/materials/${materialId}`, {
      method: "PUT",
      body: JSON.stringify(materialData),
    })
  } catch (error) {
    console.error(`Error updating material ${materialId}:`, error)
    return {
      success: true,
      data: {
        ...dummyData.materials.find((m) => m.id === materialId),
        ...materialData,
      },
    }
  }
}

export async function deleteMaterial(materialId: number) {
  try {
    return await fetchWithAuth(`/admin/materials/${materialId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error(`Error deleting material ${materialId}:`, error)
    return { success: true, message: "Material deleted successfully (dummy)" }
  }
}

export async function createQuiz(quizData: Partial<Quiz>) {
  try {
    return await fetchWithAuth(`/admin/quizzes`, {
      method: "POST",
      body: JSON.stringify(quizData),
    })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return {
      success: true,
      data: {
        id: Math.max(...dummyData.quizzes.map((q) => q.id)) + 1,
        ...quizData,
        status: "unattempted",
      },
    }
  }
}

export async function updateQuiz(quizId: number, quizData: Partial<Quiz>) {
  try {
    return await fetchWithAuth(`/admin/quizzes/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    })
  } catch (error) {
    console.error(`Error updating quiz ${quizId}:`, error)
    return {
      success: true,
      data: {
        ...dummyData.quizzes.find((q) => q.id === quizId),
        ...quizData,
      },
    }
  }
}

export async function deleteQuiz(quizId: number) {
  try {
    return await fetchWithAuth(`/admin/quizzes/${quizId}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error(`Error deleting quiz ${quizId}:`, error)
    return { success: true, message: "Quiz deleted successfully (dummy)" }
  }
}

// Dummy data untuk fallback
export const dummyData = {
  levels: [
    {
      id: 1,
      name: "Pengenalan Struktur Data",
      order: 1,
      description: "Memahami konsep dasar struktur data",
      status: "completed",
      keterangan: "Level ini sudah selesai",
    },
    {
      id: 2,
      name: "Array dan Linked List",
      order: 2,
      description: "Mempelajari array dan linked list",
      status: "ongoing",
      keterangan: "Level ini sedang dipelajari",
    },
    {
      id: 3,
      name: "Stack dan Queue",
      order: 3,
      description: "Mempelajari stack dan queue",
      status: "unlocked",
      keterangan: "Level ini sudah terbuka",
    },
    {
      id: 4,
      name: "Tree dan Graph",
      order: 4,
      description: "Mempelajari tree dan graph",
      status: "locked",
      keterangan: "Selesaikan level sebelumnya untuk membuka level ini",
    },
  ],

  materials: [
    {
      id: 1,
      level_id: 1,
      title: "Apa itu Struktur Data?",
      type: "text",
      content: `
# Pengenalan Struktur Data

Struktur data adalah cara untuk mengorganisir dan menyimpan data sehingga dapat diakses dan dimodifikasi secara efisien. Struktur data yang berbeda cocok untuk aplikasi yang berbeda, dan beberapa struktur data sangat khusus untuk tugas-tugas tertentu.

## Mengapa Struktur Data Penting?

1. **Efisiensi**: Struktur data yang tepat dapat meningkatkan kinerja program
2. **Penggunaan Memori**: Membantu mengoptimalkan penggunaan memori
3. **Kemudahan Penggunaan**: Membuat kode lebih terorganisir dan mudah dipahami

## Jenis-jenis Struktur Data

Struktur data dapat dibagi menjadi dua kategori utama:

1. **Struktur Data Primitif**: Integer, Float, Character, Boolean
2. **Struktur Data Non-Primitif**: Array, Linked List, Stack, Queue, Tree, Graph

Pada level pembelajaran ini, kita akan membahas dasar-dasar struktur data dan mengapa penting untuk memahaminya sebelum mempelajari algoritma dan pemrograman lebih lanjut.
      `,
      order: 1,
      status: "completed",
    },
    {
      id: 2,
      level_id: 1,
      title: "Kompleksitas Algoritma",
      type: "text",
      content: `
# Kompleksitas Algoritma

Kompleksitas algoritma adalah ukuran sumber daya (waktu dan ruang) yang dibutuhkan oleh algoritma untuk menyelesaikan masalah. Ini membantu kita membandingkan efisiensi algoritma yang berbeda.

## Notasi Big O

Notasi Big O digunakan untuk menggambarkan kompleksitas waktu atau ruang algoritma dalam kasus terburuk.

Beberapa kompleksitas umum:

- **O(1)**: Waktu konstan - Operasi tidak bergantung pada ukuran input
- **O(log n)**: Waktu logaritmik - Algoritma yang membagi masalah menjadi bagian yang lebih kecil
- **O(n)**: Waktu linear - Waktu eksekusi tumbuh secara linear dengan ukuran input
- **O(n log n)**: Waktu linearitmik - Umum dalam algoritma pengurutan yang efisien
- **O(n²)**: Waktu kuadratik - Umum dalam algoritma dengan nested loops
- **O(2^n)**: Waktu eksponensial - Algoritma yang menyelesaikan masalah dengan mencoba semua kemungkinan

## Pentingnya Kompleksitas Algoritma

Memahami kompleksitas algoritma membantu kita:

1. Memilih struktur data yang tepat untuk masalah tertentu
2. Mengoptimalkan kode untuk kinerja yang lebih baik
3. Memprediksi bagaimana algoritma akan berskala dengan ukuran input yang lebih besar

Pada materi selanjutnya, kita akan melihat bagaimana kompleksitas algoritma berkaitan dengan struktur data yang berbeda.
      `,
      order: 2,
      status: "completed",
    },
    {
      id: 3,
      level_id: 1,
      title: "Pengenalan Array",
      type: "text",
      content: `
# Pengenalan Array

Array adalah struktur data yang menyimpan elemen dengan tipe data yang sama dalam lokasi memori yang berdekatan. Ini adalah struktur data paling dasar dan banyak digunakan.

## Karakteristik Array

1. **Ukuran Tetap**: Ukuran array biasanya tetap setelah dideklarasikan
2. **Akses Langsung**: Elemen dapat diakses langsung menggunakan indeks
3. **Homogen**: Semua elemen memiliki tipe data yang sama
4. **Indeks Berbasis Nol**: Indeks array biasanya dimulai dari 0

## Contoh Array

\`\`\`java
// Deklarasi array dengan 5 elemen
int[] angka = new int[5];

// Inisialisasi elemen array
angka[0] = 10;
angka[1] = 20;
angka[2] = 30;
angka[3] = 40;
angka[4] = 50;

// Mengakses elemen array
System.out.println(angka[2]); // Output: 30
\`\`\`

## Kompleksitas Waktu Operasi Array

- **Akses**: O(1) - Waktu konstan
- **Pencarian**: O(n) - Waktu linear untuk pencarian sekuensial
- **Penyisipan/Penghapusan di akhir**: O(1) - Waktu konstan
- **Penyisipan/Penghapusan di awal atau tengah**: O(n) - Waktu linear karena perlu menggeser elemen

Array adalah dasar untuk memahami struktur data yang lebih kompleks. Pada level berikutnya, kita akan mempelajari array lebih dalam dan juga linked list.
      `,
      order: 3,
      status: "reading",
    },
    {
      id: 4,
      level_id: 1,
      title: "Visualisasi Struktur Data",
      type: "image",
      content: "/placeholder.svg?height=400&width=600",
      order: 4,
      status: "unread",
    },
    {
      id: 5,
      level_id: 2,
      title: "Array Satu Dimensi",
      type: "text",
      content: `
# Array Satu Dimensi

Array satu dimensi adalah kumpulan elemen dengan tipe data yang sama yang disimpan dalam lokasi memori yang berdekatan dan dapat diakses menggunakan satu indeks.

## Deklarasi dan Inisialisasi

Berikut adalah cara mendeklarasikan dan menginisialisasi array satu dimensi dalam beberapa bahasa pemrograman:

### Java
\`\`\`java
// Deklarasi
int[] angka = new int[5];

// Inisialisasi
angka[0] = 10;
angka[1] = 20;
angka[2] = 30;
angka[3] = 40;
angka[4] = 50;

// Deklarasi dan inisialisasi sekaligus
int[] angka2 = {10, 20, 30, 40, 50};
\`\`\`

### Python
\`\`\`python
# Deklarasi dan inisialisasi
angka = [10, 20, 30, 40, 50]

# Mengakses elemen
print(angka[2])  # Output: 30
\`\`\`

### JavaScript
\`\`\`javascript
// Deklarasi dan inisialisasi
let angka = [10, 20, 30, 40, 50];

// Mengakses elemen
console.log(angka[2]);  // Output: 30
\`\`\`

## Operasi Umum pada Array

1. **Traversal**: Mengunjungi setiap elemen array
2. **Pencarian**: Menemukan elemen tertentu dalam array
3. **Penyisipan**: Menambahkan elemen baru ke array
4. **Penghapusan**: Menghapus elemen dari array
5. **Pengurutan**: Mengurutkan elemen array

## Kelebihan dan Kekurangan Array

### Kelebihan
- Akses elemen cepat (O(1))
- Sederhana dan mudah digunakan
- Efisien untuk menyimpan dan mengakses data secara berurutan

### Kekurangan
- Ukuran tetap (untuk array statis)
- Penyisipan dan penghapusan tidak efisien
- Pemborosan memori jika ukuran array terlalu besar

Pada materi selanjutnya, kita akan mempelajari array multi dimensi dan implementasinya dalam pemecahan masalah.
      `,
      order: 1,
      status: "reading",
    },
    {
      id: 6,
      level_id: 2,
      title: "Array Multi Dimensi",
      type: "text",
      content: `
# Array Multi Dimensi

Array multi dimensi adalah array yang memiliki lebih dari satu dimensi. Array dua dimensi adalah yang paling umum, yang dapat dibayangkan sebagai tabel dengan baris dan kolom.

## Array Dua Dimensi

Array dua dimensi adalah array dari array, di mana setiap elemen array utama adalah array lain.

### Deklarasi dan Inisialisasi

#### Java
\`\`\`java
// Deklarasi
int[][] matriks = new int[3][3];

// Inisialisasi
matriks[0][0] = 1; matriks[0][1] = 2; matriks[0][2] = 3;
matriks[1][0] = 4; matriks[1][1] = 5; matriks[1][2] = 6;
matriks[2][0] = 7; matriks[2][1] = 8; matriks[2][2] = 9;

// Deklarasi dan inisialisasi sekaligus
int[][] matriks2 = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
\`\`\`

#### Python
\`\`\`python
# Deklarasi dan inisialisasi
matriks = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Mengakses elemen
print(matriks[1][2])  # Output: 6
\`\`\`

#### JavaScript
\`\`\`javascript
// Deklarasi dan inisialisasi
let matriks = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Mengakses elemen
console.log(matriks[1][2]);  // Output: 6
\`\`\`

## Traversal Array Dua Dimensi

Untuk mengakses semua elemen array dua dimensi, kita perlu menggunakan dua loop bersarang:

\`\`\`java
for (int i = 0; i < matriks.length; i++) {
    for (int j = 0; j < matriks[i].length; j++) {
        System.out.print(matriks[i][j] + " ");
    }
    System.out.println();
}
\`\`\`

## Aplikasi Array Multi Dimensi

1. **Matriks**: Representasi dan operasi matriks matematika
2. **Gambar**: Representasi gambar digital (setiap piksel adalah elemen array)
3. **Tabel**: Menyimpan data dalam format tabel
4. **Game**: Representasi papan permainan seperti catur atau tic-tac-toe

Array multi dimensi sangat berguna untuk menyimpan dan memanipulasi data yang memiliki struktur baris dan kolom. Pada materi selanjutnya, kita akan mempelajari linked list, struktur data yang mengatasi beberapa keterbatasan array.
      `,
      order: 2,
      status: "unread",
    },
    {
      id: 7,
      level_id: 2,
      title: "Pengenalan Linked List",
      type: "text",
      content: `
# Pengenalan Linked List

Linked list adalah struktur data linear yang terdiri dari serangkaian elemen yang disebut node. Setiap node berisi data dan referensi (atau pointer) ke node berikutnya dalam urutan.

## Struktur Node

Sebuah node dalam linked list biasanya memiliki dua komponen:
1. **Data**: Nilai yang disimpan dalam node
2. **Next**: Referensi ke node berikutnya

## Jenis Linked List

1. **Singly Linked List**: Setiap node memiliki referensi ke node berikutnya
2. **Doubly Linked List**: Setiap node memiliki referensi ke node berikutnya dan sebelumnya
3. **Circular Linked List**: Node terakhir memiliki referensi ke node pertama

## Implementasi Singly Linked List

### Java
\`\`\`java
class Node {
    int data;
    Node next;
    
    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    Node head;
    
    // Menambahkan node baru di akhir list
    public void append(int data) {
        Node newNode = new Node(data);
        
        // Jika list kosong, node baru menjadi head
        if (head == null) {
            head = newNode;
            return;
        }
        
        // Traversal ke node terakhir
        Node last = head;
        while (last.next != null) {
            last = last.next;
        }
        
        // Menambahkan node baru setelah node terakhir
        last.next = newNode;
    }
    
    // Menampilkan isi linked list
    public void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}

// Penggunaan
LinkedList list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);
list.display(); // Output: 10 -> 20 -> 30 -> null
\`\`\`

## Kelebihan dan Kekurangan Linked List

### Kelebihan
- Ukuran dinamis (dapat tumbuh dan menyusut selama eksekusi)
- Penyisipan dan penghapusan efisien (tidak perlu menggeser elemen)
- Alokasi memori efisien (hanya mengalokasikan memori yang diperlukan)

### Kekurangan
- Akses elemen lebih lambat dibandingkan array (O(n) vs O(1))
- Membutuhkan memori tambahan untuk menyimpan pointer
- Tidak ada akses langsung ke elemen (harus traversal dari awal)

Linked list sangat berguna ketika ukuran data tidak diketahui sebelumnya dan ketika operasi penyisipan dan penghapusan sering dilakukan. Pada materi selanjutnya, kita akan mempelajari implementasi dan operasi linked list lebih detail.
      `,
      order: 3,
      status: "unread",
    },
    {
      id: 8,
      level_id: 2,
      title: "Visualisasi Array vs Linked List",
      type: "image",
      content: "/placeholder.svg?height=400&width=600",
      order: 4,
      status: "unread",
    },
    {
      id: 9,
      level_id: 3,
      title: "Pengenalan Stack",
      type: "text",
      content: `
# Pengenalan Stack

Stack adalah struktur data linear yang mengikuti prinsip LIFO (Last In First Out), di mana elemen yang terakhir dimasukkan adalah elemen pertama yang dikeluarkan.

## Operasi Dasar Stack

1. **Push**: Menambahkan elemen ke bagian atas stack
2. **Pop**: Menghapus elemen dari bagian atas stack
3. **Peek/Top**: Melihat elemen di bagian atas stack tanpa menghapusnya
4. **isEmpty**: Memeriksa apakah stack kosong

## Implementasi Stack

Stack dapat diimplementasikan menggunakan array atau linked list.

### Implementasi Stack Menggunakan Array (Java)

\`\`\`java
class Stack {
    private int maxSize;
    private int[] stackArray;
    private int top;
    
    public Stack(int size) {
        maxSize = size;
        stackArray = new int[maxSize];
        top = -1; // Stack kosong
    }
    
    // Menambahkan elemen ke stack
    public void push(int value) {
        if (top < maxSize - 1) {
            stackArray[++top] = value;
        } else {
            System.out.println("Stack overflow");
        }
    }
    
    // Menghapus elemen dari stack
    public int pop() {
        if (top >= 0) {
            return stackArray[top--];
        } else {
            System.out.println("Stack underflow");
            return -1;
        }
    }
    
    // Melihat elemen teratas
    public int peek() {
        if (top >= 0) {
            return stackArray[top];
        } else {
            System.out.println("Stack is empty");
            return -1;
        }
    }
    
    // Memeriksa apakah stack kosong
    public boolean isEmpty() {
        return (top == -1);
    }
}

// Penggunaan
Stack stack = new Stack(3);
stack.push(10);
stack.push(20);
stack.push(30);
System.out.println(stack.pop()); // Output: 30
System.out.println(stack.peek()); // Output: 20
\`\`\`

## Aplikasi Stack

1. **Evaluasi Ekspresi**: Mengkonversi infix ke postfix, evaluasi ekspresi postfix
2. **Pencocokan Tanda Kurung**: Memeriksa apakah tanda kurung dalam ekspresi seimbang
3. **Undo Mechanism**: Implementasi fitur undo dalam aplikasi
4. **Function Call Management**: Mengelola pemanggilan fungsi dalam bahasa pemrograman
5. **Backtracking Algorithms**: Algoritma seperti maze solving, permainan puzzle

Stack adalah struktur data yang sangat berguna dalam banyak aplikasi pemrograman. Pada materi selanjutnya, kita akan mempelajari queue, struktur data yang mengikuti prinsip FIFO (First In First Out).
      `,
      order: 1,
      status: "unread",
    },
  ],

  quizzes: [
    {
      id: 1,
      level_id: 1,
      title: "Quiz: Pengenalan Struktur Data",
      description: "Uji pemahaman Anda tentang konsep dasar struktur data",
      time_limit: 15,
      passing_score: 70,
      status: "unattempted",
      questions: [
        {
          id: 1,
          quiz_id: 1,
          question: "Apa yang dimaksud dengan struktur data?",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Cara untuk mengorganisir dan menyimpan data" },
            { id: "b", text: "Algoritma untuk memproses data" },
            { id: "c", text: "Bahasa pemrograman untuk manipulasi data" },
            { id: "d", text: "Format file untuk menyimpan data" },
          ],
          correct_answer: "a",
          explanation:
            "Struktur data adalah cara untuk mengorganisir dan menyimpan data sehingga dapat diakses dan dimodifikasi secara efisien.",
          points: 10,
        },
        {
          id: 2,
          quiz_id: 1,
          question: "Manakah dari berikut ini yang merupakan struktur data primitif?",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Array" },
            { id: "b", text: "Linked List" },
            { id: "c", text: "Integer" },
            { id: "d", text: "Stack" },
          ],
          correct_answer: "c",
          explanation:
            "Integer adalah struktur data primitif, sementara Array, Linked List, dan Stack adalah struktur data non-primitif.",
          points: 10,
        },
        {
          id: 3,
          quiz_id: 1,
          question: "Kompleksitas waktu untuk mengakses elemen array adalah...",
          type: "multiple_choice",
          options: [
            { id: "a", text: "O(1)" },
            { id: "b", text: "O(log n)" },
            { id: "c", text: "O(n)" },
            { id: "d", text: "O(n²)" },
          ],
          correct_answer: "a",
          explanation:
            "Kompleksitas waktu untuk mengakses elemen array adalah O(1) karena elemen dapat diakses langsung menggunakan indeks.",
          points: 10,
        },
        {
          id: 4,
          quiz_id: 1,
          question: "Notasi Big O digunakan untuk...",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Menggambarkan ukuran struktur data" },
            { id: "b", text: "Menggambarkan kompleksitas algoritma" },
            { id: "c", text: "Menggambarkan sintaks bahasa pemrograman" },
            { id: "d", text: "Menggambarkan format data" },
          ],
          correct_answer: "b",
          explanation:
            "Notasi Big O digunakan untuk menggambarkan kompleksitas waktu atau ruang algoritma dalam kasus terburuk.",
          points: 10,
        },
        {
          id: 5,
          quiz_id: 1,
          question: "Array memiliki ukuran yang tetap setelah dideklarasikan.",
          type: "true_false",
          options: [
            { id: "true", text: "Benar" },
            { id: "false", text: "Salah" },
          ],
          correct_answer: "true",
          explanation:
            "Benar, array statis memiliki ukuran yang tetap setelah dideklarasikan. Untuk ukuran dinamis, diperlukan struktur data lain seperti ArrayList atau Vector.",
          points: 10,
        },
      ],
    },
    {
      id: 2,
      level_id: 2,
      title: "Quiz: Array dan Linked List",
      description: "Uji pemahaman Anda tentang array dan linked list",
      time_limit: 20,
      passing_score: 70,
      status: "unattempted",
      questions: [
        {
          id: 6,
          quiz_id: 2,
          question: "Apa perbedaan utama antara array dan linked list?",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Array memiliki ukuran tetap, linked list memiliki ukuran dinamis" },
            { id: "b", text: "Array hanya dapat menyimpan angka, linked list dapat menyimpan berbagai tipe data" },
            { id: "c", text: "Array lebih cepat, linked list lebih lambat dalam semua operasi" },
            { id: "d", text: "Array hanya dapat digunakan dalam bahasa pemrograman tertentu" },
          ],
          correct_answer: "a",
          explanation:
            "Perbedaan utama adalah array memiliki ukuran tetap setelah dideklarasikan, sementara linked list dapat tumbuh atau menyusut secara dinamis selama eksekusi program.",
          points: 10,
        },
        {
          id: 7,
          quiz_id: 2,
          question: "Dalam linked list, setiap elemen disebut...",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Index" },
            { id: "b", text: "Pointer" },
            { id: "c", text: "Node" },
            { id: "d", text: "Element" },
          ],
          correct_answer: "c",
          explanation:
            "Dalam linked list, setiap elemen disebut node. Node berisi data dan referensi (pointer) ke node berikutnya.",
          points: 10,
        },
        {
          id: 8,
          quiz_id: 2,
          question: "Manakah operasi berikut yang lebih efisien pada linked list dibandingkan array?",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Mengakses elemen secara acak" },
            { id: "b", text: "Menyisipkan elemen di awal" },
            { id: "c", text: "Mencari elemen" },
            { id: "d", text: "Mengakses elemen terakhir" },
          ],
          correct_answer: "b",
          explanation:
            "Menyisipkan elemen di awal linked list memiliki kompleksitas O(1), sementara pada array memiliki kompleksitas O(n) karena perlu menggeser semua elemen.",
          points: 10,
        },
        {
          id: 9,
          quiz_id: 2,
          question: "Array dua dimensi dapat digunakan untuk merepresentasikan...",
          type: "multiple_choice",
          options: [
            { id: "a", text: "Linked list" },
            { id: "b", text: "Stack" },
            { id: "c", text: "Queue" },
            { id: "d", text: "Matriks" },
          ],
          correct_answer: "d",
          explanation:
            "Array dua dimensi sering digunakan untuk merepresentasikan matriks, yang memiliki struktur baris dan kolom.",
          points: 10,
        },
        {
          id: 10,
          quiz_id: 2,
          question: "Dalam doubly linked list, setiap node memiliki referensi ke node berikutnya dan sebelumnya.",
          type: "true_false",
          options: [
            { id: "true", text: "Benar" },
            { id: "false", text: "Salah" },
          ],
          correct_answer: "true",
          explanation:
            "Benar, dalam doubly linked list, setiap node memiliki dua referensi: satu ke node berikutnya dan satu lagi ke node sebelumnya.",
          points: 10,
        },
      ],
    },
  ],

  progress: [
    {
      user_id: 1,
      level_id: 1,
      status: "completed",
      progress_percentage: 100,
      completed_materials: [1, 2, 3, 4],
      completed_quizzes: [1],
      xp_earned: 150,
      last_activity_at: "2023-05-10T15:30:00Z",
    },
    {
      user_id: 1,
      level_id: 2,
      status: "in_progress",
      progress_percentage: 40,
      completed_materials: [5],
      completed_quizzes: [],
      xp_earned: 50,
      last_activity_at: "2023-05-12T10:15:00Z",
    },
    {
      user_id: 1,
      level_id: 3,
      status: "not_started",
      progress_percentage: 0,
      completed_materials: [],
      completed_quizzes: [],
      xp_earned: 0,
      last_activity_at: null,
    },
  ],

  badges: [
    {
      id: 1,
      name: "Pemula Struktur Data",
      description: "Menyelesaikan level pertama",
      image_url: "/placeholder.svg?height=100&width=100",
      criteria: "Menyelesaikan semua materi dan quiz pada level Pengenalan Struktur Data",
      earned_at: "2023-05-10T16:00:00Z",
    },
    {
      id: 2,
      name: "Quiz Master",
      description: "Mendapatkan nilai 100 pada quiz",
      image_url: "/placeholder.svg?height=100&width=100",
      criteria: "Mendapatkan nilai 100 pada quiz apapun",
      earned_at: "2023-05-10T16:00:00Z",
    },
    {
      id: 3,
      name: "Array Expert",
      description: "Menguasai materi array",
      image_url: "/placeholder.svg?height=100&width=100",
      criteria: "Menyelesaikan semua materi dan quiz tentang array",
      earned_at: null,
    },
    {
      id: 4,
      name: "Linked List Explorer",
      description: "Menyelesaikan materi linked list",
      image_url: "/placeholder.svg?height=100&width=100",
      criteria: "Menyelesaikan semua materi tentang linked list",
      earned_at: null,
    },
    {
      id: 5,
      name: "Stack & Queue Specialist",
      description: "Menguasai stack dan queue",
      image_url: "/placeholder.svg?height=100&width=100",
      criteria: "Menyelesaikan semua materi dan quiz tentang stack dan queue",
      earned_at: null,
    },
    {
      id: 6,
      name: "Consistent Learner",
      description: "Belajar 5 hari berturut-turut",
      image_url: "/placeholder.svg?height=100&width=100",
      criteria: "Login dan menyelesaikan minimal 1 materi selama 5 hari berturut-turut",
      earned_at: null,
    },
  ],

  leaderboard: [
    {
      user_id: 1,
      user_name: "Pengguna Demo",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 1,
      xp: 250,
      badges_count: 2,
      level_completed: 1,
    },
    {
      user_id: 2,
      user_name: "Budi Santoso",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 2,
      xp: 230,
      badges_count: 3,
      level_completed: 1,
    },
    {
      user_id: 3,
      user_name: "Siti Nurhaliza",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 3,
      xp: 210,
      badges_count: 2,
      level_completed: 1,
    },
    {
      user_id: 4,
      user_name: "Ahmad Rizki",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 4,
      xp: 180,
      badges_count: 1,
      level_completed: 1,
    },
    {
      user_id: 5,
      user_name: "Dewi Lestari",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 5,
      xp: 150,
      badges_count: 1,
      level_completed: 1,
    },
    {
      user_id: 6,
      user_name: "Rudi Hartono",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 6,
      xp: 120,
      badges_count: 1,
      level_completed: 0,
    },
    {
      user_id: 7,
      user_name: "Rina Wijaya",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 7,
      xp: 100,
      badges_count: 1,
      level_completed: 0,
    },
    {
      user_id: 8,
      user_name: "Doni Kusuma",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 8,
      xp: 90,
      badges_count: 0,
      level_completed: 0,
    },
    {
      user_id: 9,
      user_name: "Lia Permata",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 9,
      xp: 80,
      badges_count: 0,
      level_completed: 0,
    },
    {
      user_id: 10,
      user_name: "Bima Sakti",
      user_avatar: "/placeholder.svg?height=50&width=50",
      rank: 10,
      xp: 70,
      badges_count: 0,
      level_completed: 0,
    },
  ],

  adminStats: {
    total_users: 150,
    active_users: 87,
    completed_levels: 210,
    average_quiz_score: 78.5,
    total_badges_earned: 320,
  },

  users: [
    {
      id: 1,
      name: "Pengguna Demo",
      email: "demo@example.com",
      role: "student",
      avatar: "/placeholder.svg?height=50&width=50",
      xp: 250,
      rank: 1,
      badges_count: 2,
      joined_at: "2023-04-15T10:00:00Z",
    },
    {
      id: 2,
      name: "Budi Santoso",
      email: "budi@example.com",
      role: "student",
      avatar: "/placeholder.svg?height=50&width=50",
      xp: 230,
      rank: 2,
      badges_count: 3,
      joined_at: "2023-04-16T11:30:00Z",
    },
    {
      id: 3,
      name: "Siti Nurhaliza",
      email: "siti@example.com",
      role: "student",
      avatar: "/placeholder.svg?height=50&width=50",
      xp: 210,
      rank: 3,
      badges_count: 2,
      joined_at: "2023-04-17T09:15:00Z",
    },
    {
      id: 4,
      name: "Ahmad Rizki",
      email: "ahmad@example.com",
      role: "admin",
      avatar: "/placeholder.svg?height=50&width=50",
      xp: 180,
      rank: 4,
      badges_count: 1,
      joined_at: "2023-04-10T14:20:00Z",
    },
    {
      id: 5,
      name: "Dewi Lestari",
      email: "dewi@example.com",
      role: "student",
      avatar: "/placeholder.svg?height=50&width=50",
      xp: 150,
      rank: 5,
      badges_count: 1,
      joined_at: "2023-04-20T16:45:00Z",
    },
  ],

  user: {
    id: 1,
    name: "Pengguna Demo",
    email: "demo@example.com",
    role: "student",
  },
}
