import { createStyles } from 'antd-style';

/** 与 TutorialPage/ProjectManageGG/ProjectDetail 页头一致 */
const useStyles = createStyles(({ token }) => ({
  pageHeader: {
    '.ant-page-header-heading-extra > * + *': { marginLeft: '8px' },
    [`@media screen and (max-width: ${token.screenSM}px)`]: {
      '.ant-pro-page-header-wrap-row': {
        flexDirection: 'column',
      },
    },
  },
}));

export default useStyles;
