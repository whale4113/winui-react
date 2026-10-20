# WinUI 源码覆盖清单

参考提交：09cfc8ff3fbf556166dd813ae9b81646716f54bf

105 个 Web 控件/组合/布局/材质示例；125 份 standard + perf2026 资源字典。基础颜色从 Common_themeresources_any.xaml 原值转换 ARGB → CSS RGBA。控件以 standard 模板为基线，perf2026 字典用于对照查询，未声称两套模板均独立实现。

未匹配的独立主题控件：无。Common、CornerRadius、Deprecated、TextControlsCommon、TabularSurfaces 为共享/兼容资源字典，不计为交互控件。

这里的覆盖表示存在可运行示例与源码对应关系，不表示全部原生 API 或像素级一致性。每个控件页面的“实现范围”列出剩余差异。

| Control | Category | Local source |
| --- | --- | --- |
| Button | Basic input | controls/dev/CommonStyles/Button_themeresources.xaml |
| RepeatButton | Basic input | controls/dev/CommonStyles/RepeatButton_themeresources.xaml |
| HyperlinkButton | Basic input | controls/dev/CommonStyles/HyperlinkButton_themeresources.xaml |
| ToggleButton | Basic input | controls/dev/CommonStyles/ToggleButton_themeresources.xaml |
| DropDownButton | Basic input | controls/dev/DropDownButton/DropDownButton_themeresources.xaml |
| SplitButton | Basic input | controls/dev/SplitButton/SplitButton_themeresources.xaml |
| ToggleSplitButton | Basic input | controls/dev/SplitButton/SplitButton_themeresources.xaml |
| ComboBox | Basic input | controls/dev/ComboBox/ComboBox_themeresources.xaml |
| CheckBox | Basic input | controls/dev/CommonStyles/CheckBox_themeresources.xaml |
| RadioButton | Basic input | controls/dev/CommonStyles/RadioButton_themeresources.xaml |
| RadioButtons | Basic input | controls/dev/RadioButtons/RadioButtons_themeresources.xaml |
| ToggleSwitch | Basic input | controls/dev/CommonStyles/ToggleSwitch_themeresources.xaml |
| Slider | Basic input | controls/dev/CommonStyles/Slider_themeresources.xaml |
| RatingControl | Basic input | controls/dev/RatingControl/RatingControl_themeresources.xaml |
| ColorPicker | Basic input | controls/dev/ColorPicker/ColorPicker_themeresources.xaml |
| ListBox | Collections | controls/dev/CommonStyles/ListBox_themeresources.xaml |
| ListView | Collections | controls/dev/CommonStyles/ListViewItem_themeresources.xaml |
| GridView | Collections | controls/dev/CommonStyles/GridViewItem_themeresources.xaml |
| TreeView | Collections | controls/dev/TreeView/TreeView_themeresources.xaml |
| TableView | Collections | controls/dev/TableView/TableView_themeresources.xaml |
| ItemsView | Collections | controls/dev/ItemsView/ItemsView_themeresources.xaml |
| ItemsRepeater | Collections | dxaml/xcp/dxaml/themes/generic.xaml |
| ItemContainer | Collections | controls/dev/ItemContainer/ItemContainer_themeresources.xaml |
| FlipView | Collections | controls/dev/CommonStyles/FlipView_themeresources.xaml |
| FlipViewItem | Collections | controls/dev/CommonStyles/FlipViewItem_themeresources.xaml |
| GridViewItem | Collections | controls/dev/CommonStyles/GridViewItem_themeresources.xaml |
| ListViewItem | Collections | controls/dev/CommonStyles/ListViewItem_themeresources.xaml |
| SwipeControl | Collections | controls/dev/SwipeControl/SwipeControl_themeresources.xaml |
| RefreshContainer | Collections | controls/dev/PullToRefresh/RefreshContainer/RefreshContainer_themeresources.xaml |
| RefreshVisualizer | Collections | controls/dev/PullToRefresh/RefreshVisualizer/RefreshVisualizer_themeresources.xaml |
| CalendarView | Date & time | controls/dev/CommonStyles/CalendarView_themeresources.xaml |
| CalendarDatePicker | Date & time | controls/dev/CommonStyles/CalendarDatePicker_themeresources.xaml |
| DatePicker | Date & time | controls/dev/CommonStyles/DatePicker_themeresources.xaml |
| TimePicker | Date & time | controls/dev/CommonStyles/TimePicker_themeresources.xaml |
| ContentDialog | Dialogs & flyouts | controls/dev/CommonStyles/ContentDialog_themeresources.xaml |
| Flyout | Dialogs & flyouts | controls/dev/CommandBarFlyout/CommandBarFlyout_themeresources.xaml |
| FlyoutPresenter | Dialogs & flyouts | controls/dev/CommonStyles/FlyoutPresenter_themeresources.xaml |
| DateTimePickerFlyout | Dialogs & flyouts | controls/dev/CommonStyles/DateTimePickerFlyout_themeresources.xaml |
| MenuFlyout | Dialogs & flyouts | controls/dev/CommonStyles/MenuFlyout_themeresources.xaml |
| CommandBarFlyout | Dialogs & flyouts | controls/dev/CommandBarFlyout/CommandBarFlyout_themeresources.xaml |
| TeachingTip | Dialogs & flyouts | controls/dev/TeachingTip/TeachingTip_themeresources.xaml |
| ToolTip | Dialogs & flyouts | controls/dev/CommonStyles/ToolTip_themeresources.xaml |
| Border | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| Canvas | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| Grid | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| RelativePanel | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| StackPanel | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| VariableSizedWrapGrid | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| LayoutPanel | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| Expander | Layout | controls/dev/Expander/Expander_themeresources.xaml |
| SplitView | Layout | controls/dev/SplitView/SplitView_themeresources.xaml |
| TwoPaneView | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| Viewbox | Layout | dxaml/xcp/dxaml/themes/generic.xaml |
| ResizeGripper | Layout | controls/dev/ResizeGripper/ResizeGripper_themeresources.xaml |
| Image | Media | controls/dev/ImageIcon/ImageIcon_themeresources.xaml |
| PersonPicture | Media | controls/dev/PersonPicture/PersonPicture_themeresources.xaml |
| MediaPlayerElement | Media | controls/dev/CommonStyles/MediaTransportControls_themeresources.xaml |
| MediaTransportControls | Media | controls/dev/CommonStyles/MediaTransportControls_themeresources.xaml |
| AnimatedIcon | Media | dxaml/xcp/dxaml/themes/generic.xaml |
| AnimatedVisualPlayer | Media | dxaml/xcp/dxaml/themes/generic.xaml |
| ParallaxView | Media | dxaml/xcp/dxaml/themes/generic.xaml |
| AppBarButton | Menus & toolbars | controls/dev/CommonStyles/AppBarButton_themeresources.xaml |
| AppBarToggleButton | Menus & toolbars | controls/dev/CommonStyles/AppBarToggleButton_themeresources.xaml |
| AppBarSeparator | Menus & toolbars | controls/dev/CommonStyles/AppBarSeparator_themeresources.xaml |
| CommandBar | Menus & toolbars | controls/dev/CommonStyles/CommandBar_themeresources.xaml |
| MenuBar | Menus & toolbars | controls/dev/MenuBar/MenuBar_themeresources.xaml |
| InkCanvas | Menus & toolbars | controls/dev/InkCanvas/InkCanvas.cpp |
| InkToolbar | Menus & toolbars | controls/dev/CommonStyles/InkToolbar_themeresources.xaml |
| MenuBarItem | Menus & toolbars | controls/dev/MenuBar/MenuBar_themeresources.xaml |
| MenuFlyoutItem | Menus & toolbars | controls/dev/CommonStyles/MenuFlyout_themeresources.xaml |
| ToggleMenuFlyoutItem | Menus & toolbars | controls/dev/CommonStyles/MenuFlyout_themeresources.xaml |
| RadioMenuFlyoutItem | Menus & toolbars | controls/dev/RadioMenuFlyoutItem/RadioMenuFlyoutItem_themeresources.xaml |
| NavigationView | Navigation | controls/dev/NavigationView/NavigationView_themeresources.xaml |
| TitleBar | Navigation | controls/dev/TitleBar/TitleBar_themeresources.xaml |
| TabView | Navigation | controls/dev/TabView/TabView_themeresources.xaml |
| Pivot | Navigation | controls/dev/CommonStyles/Pivot_themeresources.xaml |
| BreadcrumbBar | Navigation | controls/dev/Breadcrumb/BreadcrumbBar_themeresources.xaml |
| NavigationBackButton | Navigation | controls/dev/NavigationView/NavigationBackButton_themeresources.xaml |
| SelectorBar | Navigation | controls/dev/SelectorBar/SelectorBar_themeresources.xaml |
| PagerControl | Navigation | controls/dev/PagerControl/PagerControl_themeresources.xaml |
| PipsPager | Navigation | controls/dev/PipsPager/PipsPager_themeresources.xaml |
| ScrollViewer | Scrolling | controls/dev/CommonStyles/ScrollViewer_themeresources.xaml |
| ScrollView | Scrolling | controls/dev/ScrollView/ScrollView_themeresources.xaml |
| AnnotatedScrollBar | Scrolling | controls/dev/AnnotatedScrollBar/AnnotatedScrollBar_themeresources.xaml |
| ScrollBar | Scrolling | controls/dev/CommonStyles/ScrollBar_themeresources.xaml |
| ProgressBar | Status & info | controls/dev/ProgressBar/ProgressBar_themeresources.xaml |
| ProgressRing | Status & info | controls/dev/ProgressRing/ProgressRing_themeresources.xaml |
| InfoBar | Status & info | controls/dev/InfoBar/InfoBar_themeresources.xaml |
| InfoBadge | Status & info | controls/dev/InfoBadge/InfoBadge_themeresources.xaml |
| SortIndicator | Status & info | controls/dev/SortIndicator/SortIndicator_themeresources.xaml |
| TextBlock | Text | controls/dev/CommonStyles/TextBlock_themeresources.xaml |
| RichTextBlock | Text | controls/dev/CommonStyles/TextBlock_themeresources.xaml |
| Hyperlink | Text | controls/dev/CommonStyles/Hyperlink_themeresources.xaml |
| TextBox | Text | controls/dev/CommonStyles/TextBox_themeresources.xaml |
| PasswordBox | Text | controls/dev/CommonStyles/PasswordBox_themeresources.xaml |
| AutoSuggestBox | Text | controls/dev/AutoSuggestBox/AutoSuggestBox_themeresources.xaml |
| NumberBox | Text | controls/dev/NumberBox/NumberBox_themeresources.xaml |
| RichEditBox | Text | controls/dev/CommonStyles/RichEditBox_themeresources.xaml |
| SymbolIcon | Icons & materials | dxaml/xcp/dxaml/themes/generic.xaml |
| FontIcon | Icons & materials | dxaml/xcp/dxaml/themes/generic.xaml |
| PathIcon | Icons & materials | dxaml/xcp/dxaml/themes/generic.xaml |
| ImageIcon | Icons & materials | controls/dev/ImageIcon/ImageIcon_themeresources.xaml |
| AcrylicBrush | Icons & materials | controls/dev/Materials/Acrylic/AcrylicBrush_themeresources.xaml |
| RevealBrush | Icons & materials | controls/dev/Materials/Reveal/RevealBrush_themeresources.xaml |
| MicaBackdrop | Icons & materials | controls/dev/SystemBackdropElement/SystemBackdropElement.cpp |

## 依赖原生宿主的范围

WebView2、MapControl、SystemBackdropElement、系统窗口拖动/非客户区、Windows Ink 服务、IAnimatedVisualSource、原生媒体服务不由本 Web 工程提供。CSS Mica/Acrylic/Reveal、Canvas Ink 和 HTML video 只实现 Web 可表达的外观与交互。

## 验证边界

自动化验证颜色值和关键尺寸、两种主题下的全部示例渲染与若干键盘/交互流程。当前环境没有已安装的原生 WinUI Gallery 基线，未完成与原生截图的逐像素差分验证。
