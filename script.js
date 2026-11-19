// ============================================================
// 1. KHAI BÁO HẰNG SỐ VÀ BIẾN DÙNG CHUNG
// ============================================================

// khai báo hằng số KHOA_LUU_TRU, có giá trị là "danhSachViec"
// đây là tên "key" dùng để lưu và đọc dữ liệu trong LocalStorage
const KHOA_LUU_TRU = "danhSachViec";

// khai báo biến danhSachViec, có giá trị ban đầu là mảng rỗng []
// mỗi phần tử là 1 object, ví dụ: { id: 1, noiDung: "Học JS", hoanThanh: false }
var danhSachViec = [];

// lấy các phần tử HTML cần dùng thông qua id
const formNhapViec = document.getElementById("formNhapViec");
const oNhapViec = document.getElementById("oNhapViec");
const ulDanhSach = document.getElementById("danhSachViec");
const thongBaoRong = document.getElementById("thongBaoRong");


// ============================================================
// 2. HÀM LƯU / ĐỌC LOCALSTORAGE
// ============================================================

// khai báo hàm luuDanhSachViec, không có tham số
// hàm này xử lý việc ghi toàn bộ danhSachViec vào LocalStorage
// truy vào biến danhSachViec (biến dùng chung bên ngoài)
// không trả về kết quả
function luuDanhSachViec() {
  // LocalStorage chỉ lưu được chuỗi, nên phải chuyển mảng thành chuỗi JSON
  const chuoiJson = JSON.stringify(danhSachViec);

  // ghi vào LocalStorage: key là KHOA_LUU_TRU, value là chuoiJson
  localStorage.setItem(KHOA_LUU_TRU, chuoiJson);
}

// khai báo hàm taiDanhSachViec, không có tham số
// hàm này xử lý việc đọc dữ liệu từ LocalStorage và gán lại cho danhSachViec
// truy vào LocalStorage bằng key KHOA_LUU_TRU
// trả về kết quả: true nếu đọc được, false nếu chưa có hoặc dữ liệu bị hỏng
function taiDanhSachViec() {
  // đọc chuỗi từ LocalStorage, giá trị có thể là: "chuỗi JSON" | null
  const chuoiJson = localStorage.getItem(KHOA_LUU_TRU);

  // kiểm tra: nếu chuoiJson là null (chưa từng lưu) thì gán mảng rỗng và trả về false
  if (!chuoiJson) {
    danhSachViec = [];
    return false;
  }

  // dùng try...catch phòng khi dữ liệu bị sửa sai định dạng
  try {
    // chuyển chuỗi JSON ngược lại thành mảng
    const duLieu = JSON.parse(chuoiJson);

    // kiểm tra dữ liệu đọc ra phải là mảng, nếu không thì coi như hỏng
    if (!Array.isArray(duLieu)) throw new Error("Dữ liệu không phải mảng");

    // gán cho danhSachViec và trả về true
    danhSachViec = duLieu;
    return true;
  } catch (loi) {
    // in cảnh báo ra Console, gán mảng rỗng để ứng dụng không bị crash
    console.warn("Dữ liệu LocalStorage bị hỏng, dùng danh sách rỗng", loi);
    danhSachViec = [];
    return false;
  }
}


// ============================================================
// 3. HÀM XỬ LÝ DỮ LIỆU (thêm / hoàn thành / xóa)
// ============================================================

// khai báo hàm themViec, có tham số noiDung (nội dung việc cần làm)
// hàm này xử lý việc tạo việc mới, thêm vào danh sách và lưu lại
// truy vào danhSachViec để thêm phần tử mới
// trả về kết quả: object việc vừa tạo, hoặc null nếu nội dung rỗng
function themViec(noiDung) {
  // loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
  const noiDungSach = noiDung.trim();

  // kiểm tra: nếu nội dung rỗng thì trả về null (không thêm)
  if (!noiDungSach) return null;

  // khai báo hằng số viecMoi, id lấy theo thời gian hiện tại để không bị trùng
  const viecMoi = { id: Date.now(), noiDung: noiDungSach, hoanThanh: false };

  // thêm viecMoi vào cuối mảng, rồi lưu vào LocalStorage
  danhSachViec.push(viecMoi);
  luuDanhSachViec();

  // trả về viecMoi
  return viecMoi;
}

// khai báo hàm hoanThanhViec, có tham số id (id của việc cần hoàn thành)
// hàm này xử lý việc đánh dấu một việc là đã hoàn thành và lưu lại
// truy vào danhSachViec để tìm việc có id tương ứng
// trả về kết quả: true nếu thành công, false nếu không tìm thấy việc
function hoanThanhViec(id) {
  // tìm item có giá trị id trùng với giá trị id truyền vào
  const viec = danhSachViec.find((v) => v.id === id);

  // kiểm tra biến viec: nếu không tìm thấy thì trả về false
  if (!viec) return false;

  // nếu tìm thấy: gán giá trị viec.hoanThanh là true, rồi lưu lại
  viec.hoanThanh = true;
  luuDanhSachViec();

  // trả về true
  return true;
}

// khai báo hàm xoaViec, có tham số id (id của việc cần xóa)
// hàm này xử lý việc loại một việc ra khỏi danh sách và lưu lại
// truy vào danhSachViec để lọc bỏ việc có id tương ứng
// trả về kết quả: true nếu xóa được, false nếu không tìm thấy việc
function xoaViec(id) {
  // ghi nhớ số lượng việc trước khi xóa
  const soLuongTruoc = danhSachViec.length;

  // giữ lại các việc có id KHÁC id truyền vào (tức là loại bỏ việc cần xóa)
  danhSachViec = danhSachViec.filter((v) => v.id !== id);

  // nếu số lượng không đổi nghĩa là không tìm thấy việc, trả về false
  if (danhSachViec.length === soLuongTruoc) return false;

  // lưu lại và trả về true
  luuDanhSachViec();
  return true;
}


// ============================================================
// 4. HÀM HIỂN THỊ RA GIAO DIỆN
// ============================================================

// khai báo hàm hienThiDanhSach, không có tham số
// hàm này xử lý việc vẽ lại toàn bộ danhSachViec ra thẻ <ul>
// truy vào ulDanhSach và thongBaoRong
// không trả về kết quả
function hienThiDanhSach() {
  // xóa nội dung cũ trong <ul> trước khi vẽ lại
  ulDanhSach.innerHTML = "";

  // ẩn thông báo rỗng khi có việc, hiện khi danh sách rỗng
  thongBaoRong.hidden = danhSachViec.length > 0;

  // duyệt từng việc trong danhSachViec
  danhSachViec.forEach((viec) => {
    // tạo thẻ <li> cho việc này, thêm class hoan-thanh nếu việc đã xong
    const li = document.createElement("li");
    li.className = "muc-viec" + (viec.hoanThanh ? " hoan-thanh" : "");

    // tạo thẻ <span> chứa nội dung (dùng textContent để tránh chèn mã HTML lạ)
    const span = document.createElement("span");
    span.className = "noi-dung";
    span.textContent = viec.noiDung;
    li.appendChild(span);

    // chỉ hiện nút Done với việc chưa hoàn thành
    if (!viec.hoanThanh) {
      const nutDone = document.createElement("button");
      nutDone.className = "nut nut-done";
      nutDone.textContent = "Done";
      // thực hiện hoanThanhViec, khi mà user click vào button Done
      nutDone.addEventListener("click", () => {
        hoanThanhViec(viec.id);
        hienThiDanhSach();
      });
      li.appendChild(nutDone);
    }

    // tạo nút Xóa
    const nutXoa = document.createElement("button");
    nutXoa.className = "nut nut-xoa";
    nutXoa.textContent = "Xóa";
    // thực hiện xoaViec, khi mà user click vào button Xóa
    nutXoa.addEventListener("click", () => {
      xoaViec(viec.id);
      hienThiDanhSach();
    });
    li.appendChild(nutXoa);

    // thêm <li> vào <ul>
    ulDanhSach.appendChild(li);
  });
}


// ============================================================
// 5. THỰC HIỆN CÁC HÀM Ở TRÊN
// ============================================================

// thực hiện themViec, khi mà user click vào button Thêm (hoặc nhấn Enter)
formNhapViec.addEventListener("submit", (suKien) => {
  // chặn hành vi mặc định của form (tải lại trang)
  suKien.preventDefault();

  // lấy giá trị người dùng nhập và gọi hàm themViec
  const ketQua = themViec(oNhapViec.value);

  // nếu thêm thành công: xóa ô nhập, vẽ lại danh sách
  if (ketQua) {
    oNhapViec.value = "";
    hienThiDanhSach();
  }
  // đưa con trỏ về ô nhập để nhập việc tiếp theo
  oNhapViec.focus();
});

// thực hiện taiDanhSachViec, khi mà trang web vừa được mở (hoặc user bấm F5)
taiDanhSachViec();

// sau khi khôi phục dữ liệu thì vẽ danh sách ra giao diện
hienThiDanhSach();