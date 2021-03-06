import Vue from "vue";
import {
  Button,
  Row,
  Col,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  OptionGroup,
  Message,
  MessageBox,
  Scrollbar,
  Menu,
  MenuItemGroup,
  Submenu,
  MenuItem,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Badge,
  Table,
  Image,
  TableColumn,
  Tag,
  Tabs,
  TabPane,
  Timeline,
  TimelineItem,
  Card,
  Pagination,
  Notification,
  Dialog,
  DatePicker,
  Tree,
  Upload,
  Carousel,
  CarouselItem,
  Drawer,
  Cascader,
  Collapse,
  CollapseItem,
  Calendar,
  Popconfirm,
  Popover,
  TimePicker,
  InputNumber,
  Radio,
  Switch,
  Rate,
  Checkbox,
  checkboxGroup,
  Loading,
  Link,
} from "element-ui";

Message.install = () => {
  Vue.prototype.$message = Message;
};
MessageBox.install = () => {
  Vue.prototype.$confirm = MessageBox.confirm;
};
Notification.install = () => {
  Vue.prototype.$notify = Notification;
};

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Image);
Vue.use(Message);
Vue.use(MessageBox);
Vue.use(Notification);
Vue.use(Scrollbar);
Vue.use(Menu);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Badge);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Card);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Tree);
Vue.use(Upload);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Drawer);
Vue.use(Cascader);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Calendar);
Vue.use(Popconfirm);
Vue.use(Popover);
Vue.use(TimePicker);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(Rate);
Vue.use(Checkbox);
Vue.use(checkboxGroup);

Vue.use(Loading.directive);
Vue.use(Link);
