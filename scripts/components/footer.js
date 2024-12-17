const footer = () => {
    document.querySelector("footer").innerHTML = `
  <div class="container">
        <div class="row">
            <div class="col-md-12 header-footer">
                <span>
                    ∆ Chính sách mua sắm tại Silk Road
                    Các sản phẩm và dịch vụ tại Silk Road được cung cấp thông qua các đối tác chính thức.
                    Giá hiển thị trên trang chỉ mang tính tham khảo và có thể thay đổi.
                    Giá bán cuối cùng phụ thuộc vào tình trạng, kích cỡ, và phiên bản sản phẩm.
                    Thuế giá trị gia tăng (GTGT) có thể được áp dụng trên toàn bộ giá trị của đơn hàng.
                    Bạn cần xuất trình giấy tờ tùy thân hợp lệ nếu được yêu cầu (tuân theo quy định pháp luật địa
                    phương).
                    Các đối tác của Silk Road có quyền từ chối, hủy bỏ, hoặc giới hạn số lượng mua hàng vì bất kỳ lý do
                    gì.
                    Vui lòng tham khảo thêm thông tin chi tiết tại Điều khoản & Điều kiện hoặc liên hệ với dịch vụ khách
                    hàng của Silk Road.
                </span>
            </div>
            <div style="width: 100%;" class="col-md-12">
                <div class="content-footer" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        Bản quyền © Silk Road Inc. 2024 Bảo lưu mọi quyền.
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                            style="width: 24px; height: 24px; vertical-align: middle; margin-right: 5px;">
                            <path
                                d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z">
                            </path>
                        </svg>
                        <span>Việt Nam</span>
                    </div>
                </div>
            </div>
            <div class="col-md-12 policy">
                <span>
                    Chính Sách Quyền Riêng Tư |
                </span>
                <span>
                    Điều Khoản Sử Dụng |
                </span>
                <span>
                    Bán Hàng và Hoàn Tiền |
                </span>
                <span>
                    Pháp Lý |
                </span>
                <span>
                    Bản đồ trang web
                </span>
            </div>
            <div>
                <span>địa chỉ: VQCR+GP6, khu phố 6, Thủ Đức, Hồ Chí Minh</span>
            </div>
            <div class="col-md-12 social" style="display: flex; align-items: center; gap: 10px;">
                <span>theo dõi chúng tôi: </span>
                <a href="https://www.facebook.com" target="_blank" style="text-decoration: underline; color: inherit;"
                    onmouseover="this.style.color='#3b5998'" onmouseout="this.style.color='inherit'"
                    onclick="this.style.color='#3b5998'">Facebook</a>
                <span>|</span>
                <a href="https://www.instagram.com/yourprofile" target="_blank"
                    style="text-decoration: underline; color: inherit;" onmouseover="this.style.color='#C13584'"
                    onmouseout="this.style.color='inherit'" onclick="this.style.color='#C13584'">Instagram</a>
                <span>|</span>
                <a href="https://twitter.com/yourprofile" target="_blank"
                    style="text-decoration: underline; color: inherit;" onmouseover="this.style.color='#1DA1F2'"
                    onmouseout="this.style.color='inherit'" onclick="this.style.color='#1DA1F2'">Twitter</a>
                <span>|</span>
                <a href="https://www.tiktok.com/@yourprofile" target="_blank"
                    style="text-decoration: underline; color: inherit;" onmouseover="this.style.color='#69C9D0'"
                    onmouseout="this.style.color='inherit'" onclick="this.style.color='#69C9D0'">TikTok</a>
                <span>|</span>
                <a href="https://www.youtube.com/channel/yourchannel" target="_blank"
                    style="text-decoration: underline; color: inherit;" onmouseover="this.style.color='#FF0000'"
                    onmouseout="this.style.color='inherit'" onclick="this.style.color='#FF0000'">YouTube</a>
            </div>
        </div>
    </div>

`;
}