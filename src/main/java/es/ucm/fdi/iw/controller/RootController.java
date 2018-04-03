package es.ucm.fdi.iw.controller;

import java.security.Principal;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import es.ucm.fdi.iw.model.User;

@Controller	
public class RootController {

	private static Logger log = Logger.getLogger(RootController.class);
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EntityManager entityManager;
	
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "/static");
    }
    
    @RequestMapping(value = "/createUser", method = RequestMethod.POST)
	@Transactional
	public String createUser(
			@RequestParam String username, 
			@RequestParam String password,
			@RequestParam String confirmPassword, Model m) {
		User u = new User();
		u.setLogin(username);
		u.setPassword(passwordEncoder.encode(password));
		u.setRoles("USER");
		entityManager.persist(u);
		
		entityManager.flush();
		login(m);
		m.addAttribute("users", entityManager
				.createQuery("select u from User u").getResultList());
		
		
		
		return "login";
	}
    
	@GetMapping({"/", "/index"})
	public String root(Model model, Principal principal, HttpSession s) {
		log.info(principal.getName() + " de tipo " + principal.getClass());
		if (s.getAttribute("user") == null) {
			s.setAttribute("user", entityManager
					.createQuery("from User where login = :login", User.class)
                    .setParameter("login", principal.getName())
                    .getSingleResult());
		}
		// org.springframework.security.core.userdetails.User
		return "home";
	}
	
	@GetMapping("/login")
	public String login(Model m) {
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout() {
		return "logout";
	}
	
	@GetMapping("/upload")
	public String upload() {
		return "upload";
	}
	
	@GetMapping("/results")
	public String results() {
		return "results";
	}
	
	@GetMapping("/playing")
	public String playing() {
		return "playing";
	}
	
	@GetMapping("/map-design")
	public String map_design() {
		return "map-design";
	}

	@GetMapping("/code-design")
	public String code_design() {
		return "code-design";
	}
	
	@GetMapping("/profile")
	public String profile() {
		return "profile";
	}
	
	@GetMapping("/settings")
	public String settings() {
		return "settings";
	}
	
	@GetMapping("/ranking")
	public String ranking() {
		return "ranking";
	}
	
}
