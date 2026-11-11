// Chuỗi giao diện song ngữ. Tiếng Việt là mặc định ("/"), tiếng Anh ở "/en".
const strings = {
  vi: {
    nav: { home: 'Trang chủ', collections: 'Bộ sưu tập', women: 'Thời trang nữ', accessories: 'Phụ kiện', journal: 'Journal', about: 'Về chúng tôi', appointment: 'Đặt lịch hẹn' },
    skip: 'Bỏ qua đến nội dung chính',
    menu: 'Mở menu', closeMenu: 'Đóng menu',
    switchLang: 'English',
    hero: { eyebrow: 'Bộ sưu tập mới', title: 'Vẻ đẹp được may đo cho những khoảnh khắc trường tồn', cta: 'Khám phá bộ sưu tập', cta2: 'Đặt lịch tư vấn riêng' },
    home: {
      manifestoLabel: 'Tuyên ngôn',
      manifesto: 'PHUC FASHION tin rằng sự xa xỉ đích thực nằm ở những điều lặng lẽ — một đường may hoàn hảo, một chất liệu biết thở, một dáng áo tôn vinh người mặc thay vì che lấp họ.',
      featured: 'Tuyệt tác tuyển chọn', viewAll: 'Xem tất cả',
      collections: 'Các bộ sưu tập', atelierTitle: 'Xưởng may thủ công', atelierText: 'Mỗi thiết kế đi qua bàn tay của những nghệ nhân với hơn hai mươi năm kinh nghiệm. Từ bản phác thảo đầu tiên đến mũi chỉ cuối cùng, chúng tôi không vội vàng.',
      atelierCta: 'Câu chuyện của chúng tôi', journal: 'Từ Journal', appointmentTitle: 'Trải nghiệm riêng tư tại showroom', appointmentText: 'Hẹn một buổi thử đồ riêng cùng chuyên viên phong cách của chúng tôi, với trà, sự yên tĩnh và trọn vẹn thời gian dành cho bạn.'
    },
    product: { price: 'Giá', materials: 'Chất liệu & chăm sóc', inquire: 'Đặt lịch xem sản phẩm', related: 'Có thể bạn sẽ thích', category: { women: 'Thời trang nữ', accessories: 'Phụ kiện' }, empty: 'Chưa có sản phẩm nào trong mục này.', from: 'Thuộc bộ sưu tập' },
    filters: { all: 'Tất cả', label: 'Lọc theo danh mục' },
    journal: { title: 'Journal', intro: 'Hậu trường, show diễn và những câu chuyện về nghề may.', read: 'Đọc tiếp', back: 'Quay lại Journal', empty: 'Chưa có bài viết.' },
    about: {
      title: 'Về PHUC FASHION', lead: 'Một nhà mốt Việt Nam theo đuổi vẻ đẹp tĩnh tại.',
      p1: 'Ra đời tại Sài Gòn, PHUC FASHION bắt đầu từ một xưởng may nhỏ với niềm tin rằng thời trang cao cấp không cần ồn ào. Chúng tôi chọn từng mét lụa, từng sợi len, và để chất liệu dẫn dắt phom dáng.',
      p2: 'Mỗi bộ sưu tập là một cuộc đối thoại giữa kỹ thuật cắt may châu Âu và sự tinh tế Á Đông — những đường nét tối giản, bảng màu trầm, và chi tiết chỉ người mặc mới thực sự cảm nhận.',
      values: [['Chất liệu', 'Lụa tơ tằm, len merino và da thuộc được tuyển chọn từ những xưởng dệt uy tín.'], ['Tay nghề', 'Mỗi thiết kế được hoàn thiện thủ công trong 40 đến 120 giờ.'], ['Bền vững', 'Sản xuất số lượng giới hạn, không tồn kho, không lãng phí.']]
    },
    appt: {
      title: 'Đặt lịch hẹn', intro: 'Hãy để lại thông tin, chuyên viên phong cách sẽ liên hệ xác nhận trong vòng 24 giờ.',
      name: 'Họ và tên', email: 'Email', phone: 'Số điện thoại', date: 'Ngày mong muốn', time: 'Khung giờ', service: 'Dịch vụ', message: 'Lời nhắn', messageHelp: 'Không bắt buộc. Kích cỡ, dịp sử dụng hoặc sản phẩm bạn quan tâm.',
      product: 'Sản phẩm quan tâm', submit: 'Gửi yêu cầu', sending: 'Đang gửi…', required: 'Bắt buộc',
      services: { fitting: 'Thử đồ riêng tại showroom', styling: 'Tư vấn phong cách', bridal: 'Trang phục cưới & dạ tiệc', other: 'Khác' },
      times: { morning: 'Sáng (9:00–12:00)', afternoon: 'Chiều (13:00–17:00)', evening: 'Tối (17:00–20:00)' },
      success: 'Cảm ơn bạn. Yêu cầu đã được ghi nhận, chúng tôi sẽ liên hệ sớm.',
      errors: { name: 'Vui lòng nhập họ tên.', email: 'Email chưa đúng định dạng, ví dụ: ten@email.com', phone: 'Số điện thoại cần 9–11 chữ số.', date: 'Vui lòng chọn một ngày từ hôm nay trở đi.' },
      errorSummary: 'Vui lòng kiểm tra lại các trường được đánh dấu bên dưới.',
      visit: 'Showroom', hours: 'Giờ mở cửa', hoursValue: 'Thứ Ba – Chủ Nhật, 9:00 – 20:00'
    },
    footer: { newsletter: 'Mọi thiết kế đều được hoàn thiện thủ công tại Việt Nam.', rights: 'Bảo lưu mọi quyền.', follow: 'Theo dõi', contact: 'Liên hệ', explore: 'Khám phá' },
    notFound: { title: 'Không tìm thấy trang', text: 'Trang bạn tìm có thể đã được dời đi.', back: 'Về trang chủ' }
  },
  en: {
    nav: { home: 'Home', collections: 'Collections', women: 'Womenswear', accessories: 'Accessories', journal: 'Journal', about: 'Maison', appointment: 'Book an appointment' },
    skip: 'Skip to main content',
    menu: 'Open menu', closeMenu: 'Close menu',
    switchLang: 'Tiếng Việt',
    hero: { eyebrow: 'New collection', title: 'Beauty, tailored for the moments that endure', cta: 'Explore the collection', cta2: 'Book a private consultation' },
    home: {
      manifestoLabel: 'Manifesto',
      manifesto: 'PHUC FASHION believes true luxury lives in quiet things — a flawless seam, a fabric that breathes, a silhouette that honours the wearer rather than hiding them.',
      featured: 'Selected pieces', viewAll: 'View all',
      collections: 'Collections', atelierTitle: 'The atelier', atelierText: 'Every design passes through the hands of artisans with more than twenty years of experience. From the first sketch to the final stitch, we do not hurry.',
      atelierCta: 'Our story', journal: 'From the Journal', appointmentTitle: 'A private showroom experience', appointmentText: 'Reserve a private fitting with our stylists — with tea, quiet, and time devoted entirely to you.'
    },
    product: { price: 'Price', materials: 'Materials & care', inquire: 'Book a viewing', related: 'You may also like', category: { women: 'Womenswear', accessories: 'Accessories' }, empty: 'No pieces in this category yet.', from: 'From the collection' },
    filters: { all: 'All', label: 'Filter by category' },
    journal: { title: 'Journal', intro: 'Behind the scenes, runway shows and stories of the craft.', read: 'Read more', back: 'Back to Journal', empty: 'No stories yet.' },
    about: {
      title: 'The Maison', lead: 'A Vietnamese fashion house devoted to quiet beauty.',
      p1: 'Born in Saigon, PHUC FASHION began as a small atelier with the belief that couture need not be loud. We choose every metre of silk and every thread of wool, and let the material lead the silhouette.',
      p2: 'Each collection is a conversation between European tailoring and Asian refinement — minimal lines, a subdued palette, and details only the wearer truly feels.',
      values: [['Materials', 'Mulberry silk, merino wool and fine leather sourced from respected mills.'], ['Craft', 'Each design is finished by hand over 40 to 120 hours.'], ['Responsibility', 'Limited runs, no excess stock, no waste.']]
    },
    appt: {
      title: 'Book an appointment', intro: 'Leave your details and a stylist will confirm within 24 hours.',
      name: 'Full name', email: 'Email', phone: 'Phone number', date: 'Preferred date', time: 'Time slot', service: 'Service', message: 'Message', messageHelp: 'Optional. Size, occasion or pieces you are interested in.',
      product: 'Piece of interest', submit: 'Send request', sending: 'Sending…', required: 'Required',
      services: { fitting: 'Private showroom fitting', styling: 'Styling consultation', bridal: 'Bridal & evening wear', other: 'Other' },
      times: { morning: 'Morning (9:00–12:00)', afternoon: 'Afternoon (13:00–17:00)', evening: 'Evening (17:00–20:00)' },
      success: 'Thank you. Your request has been received and we will be in touch shortly.',
      errors: { name: 'Please enter your name.', email: 'Please enter a valid email, e.g. name@email.com', phone: 'Phone number should have 9–11 digits.', date: 'Please choose a date from today onwards.' },
      errorSummary: 'Please review the highlighted fields below.',
      visit: 'Showroom', hours: 'Opening hours', hoursValue: 'Tuesday – Sunday, 9:00 – 20:00'
    },
    footer: { newsletter: 'Every piece is finished by hand in Vietnam.', rights: 'All rights reserved.', follow: 'Follow', contact: 'Contact', explore: 'Explore' },
    notFound: { title: 'Page not found', text: 'The page you are looking for may have moved.', back: 'Back to home' }
  }
};

module.exports = { strings, LANGS: ['vi', 'en'] };
