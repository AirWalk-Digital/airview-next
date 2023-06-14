
export function ControlsView({
    menu, // the menu from staticProps
    content, // will be a page or nested layout
    frontmatter = null, // frontmatter collected from the page and the mdx file
    context = null, // the context from the page to help with relative files and links
    pageData = null, // controls for the menu
    controls = null
  }) {
  
    const { navItems, csp } = createMenu(menu);
  
    
  
    let navItemsControls = null;
    // console.log('ControlView:context', context);
    if (controls) { navItemsControls = createControlMenu(controls) } else {
      navItemsControls = [
        {
          groupTitle: "Controls",
          links: []
        }];
    }
    // console.log('navItemsControls :', navItemsControls)
    const navItemsDocs = [
      {
        groupTitle: "Infrastructure-as-Code",
        links: [
          {
            label: "terraform-azure-storage",
            url: "",
          },
        ],
      },
      {
        groupTitle: "Designs",
        links: [
          {
            label: "Static Content Website",
            url: "",
          },
          {
            label: "Data Lakes",
            url: "",
          },
        ],
      },
    ];
    const navDrawerWidth = 300;
    const topBarHeight = 64;
    const [menuOpen, setMenuOpen] = useState(true);
  
    const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);
    return (
      <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        <Topbar onNavButtonClick={handleOnNavButtonClick}
          navOpen={menuOpen}
          menu={true}
          topBarHeight={topBarHeight} />
        <NavigationDrawer
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        >
          <Menu
            menuTitle="Controls"
            menuItems={navItemsControls}
            initialCollapsed={false}
            loading={false}
            fetching={false}
            linkComponent={Link}
          />
          <Menu
            menuTitle="Documentation"
            menuItems={navItemsDocs}
            initialCollapsed={false}
            loading={false}
            fetching={false}
            linkComponent={Link}
  
          />
        </NavigationDrawer>
        <div
          style={{
            marginTop: topBarHeight,
            paddingLeft: menuOpen ? navDrawerWidth : 0,
          }}
        ><Box sx={{ px: '5%' }}>
    
            <Typography variant="h1" component="h1">Control Overview</Typography>
            <ControlDataDisplay data={controls.filter(obj => obj.file === context.router.asPath)} />
          </Box>
        </div>
      </ThemeProvider>
    )
  }
  