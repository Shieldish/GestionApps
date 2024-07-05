import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Animated from 'react-native-reanimated';

const AboutUsScreen = () => {
    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.content}>
                {/* Main content area */}
                <View style={styles.mainContent}>
                    {/* Your content here */}
                    <Text style={styles.title}>GESTION STAGES</Text>
                    <Text>
                        Here you can use rows and columns to organize your footer content. Lorem ipsum
                        dolor sit amet, consectetur adipisicing elit.
                    </Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Section: Social media */}
                <View style={styles.socialMediaSection}>
                    <Text style={styles.myText}>Get connected with us on social networks:</Text>
                    <View style={styles.socialLinks}>
                        {/* Social links */}
                        <TouchableOpacity style={styles.socialLink}>
                            <Icon name="facebook" size={30} color="#3b5998" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLink}>
                            <Icon name="twitter" size={30} color="#1da1f2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLink}>
                            <Icon name="google" size={30} color="#ea4335" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLink}>
                            <Icon name="instagram" size={30} color="#c32aa3" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLink}>
                            <Icon name="linkedin" size={30} color="#0077b5" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLink}>
                            <Icon name="github" size={30} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                {/* Section: Links */}
                <View style={styles.linksSection}>
                    <Text style={styles.linksHeader}>Programs</Text>
                    <Text style={styles.link}>Planning</Text>
                    <Text style={styles.link}>Affectation/Encadrement</Text>
                    <Text style={styles.link}>Stages</Text>
                    <Text style={styles.link}>Soutenance</Text>
                </View>
                
                {/* Additional links and contact */}
                <View style={styles.contactSection}>
                    <Text style={styles.linksHeader}>Useful links</Text>
                    <Text style={styles.link}>Admin</Text>
                    <Text style={styles.link}>Settings</Text>
                    <Text style={styles.link}>Orders</Text>
                    <Text style={styles.link}>Help</Text>
                    
                    <Text style={styles.linksHeader}>Contact</Text>
                    <Text><Icon name="home" style={styles.icon} /> Sfax, Rue Soukra km3 fss-sfax, Tunisie</Text>
                    <Text><Icon name="envelope" style={styles.icon} /> kossisamuel.gabiam@fss.u-sfax.tn</Text>
                    <Text><Icon name="phone" style={styles.icon} /> +216 11223344</Text>
                    <Text><Icon name="fax" style={styles.icon} /> +216 22334455</Text>
                </View>
                
                {/* Copyright */}
                <View style={styles.copyright}>
                    <Text>&copy; 2024 Gestion des Stages. All rights reserved.</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    mainContent: {
        padding: 20,
    },
    footer: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 20,
    },
    socialMediaSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    socialLink: {
        marginHorizontal: 10,
    },
    linksSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    linksHeader: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    link: {
        marginBottom: 5,
    },
    contactSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    icon: {
        marginRight: 5,
        fontSize: 16,
    },
    copyright: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    myText :{
      color: '#000000',
      fontSize: 16,
      fontWeight:'bold',
      textAlign:'center'
    }
});

export default AboutUsScreen;
