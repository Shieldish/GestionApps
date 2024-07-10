
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 10,
      paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for StatusBar height on Android
    },
    searchInput: {
      backgroundColor: '#FFFFFF',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    accordion: {
      marginBottom: 10,
      backgroundColor: '#FFFFFF',
      elevation: 3,
      borderRadius: 5,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    headerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#192f6a',
    },
    body: {
      overflow: 'hidden',
      paddingHorizontal: 10,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    filterText: {
      marginLeft: 10,
      fontSize: 16,
      color: '#7f8c8d',
    },
    activeFilter: {
      backgroundColor: '#E0E0E0',
    },
    activeFilterText: {
      color: '#192f6a',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    favoriteButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardSubtitle: {
      fontSize: 16,
      color: '#757575',
      marginBottom: 5,
    },
    cardInfo: {
      marginBottom: 3,
    },
    cardInfo2: {
      color: '#757575',
      marginBottom: 3,
    },
    cardInfo3: {
      color: '#757575',
      marginTop: 5,
    },
    button: {
      backgroundColor: '#192f6a',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    divider: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: 10,
    },
    notFoundText: {
      fontSize: 16,
      color: '#757575',
    },
  });
  